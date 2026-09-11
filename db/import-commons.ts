import "dotenv/config";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { and, eq, sql as drizzleSql } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { db, pool } from "./index";
import { categories, contentAssets, contentItems, users } from "./schema";

const TARGET_PER_CATEGORY = 31;
const commonsHeaders = {
  "User-Agent": "FlyerHub catalog importer/1.0 (https://github.com/Ghost-a-s/flyerhub; flyerhubapp@gmail.com)",
};
const catalog = {
  "church-flyers": ["church poster", "worship flyer", "gospel event poster"],
  "birthday-flyers": ["birthday poster", "birthday celebration flyer", "birthday party poster"],
  "business-flyers": ["business poster", "business event flyer", "business promotion poster"],
  "party-flyers": ["party poster", "party flyer", "celebration poster"],
  "restaurant-flyers": ["restaurant poster", "food festival flyer", "restaurant menu poster"],
  "event-flyers": ["event flyer", "event poster", "conference poster"],
} as const;

type CategoryId = keyof typeof catalog;
type CommonsPage = {
  pageid: number;
  title: string;
  imageinfo?: Array<{
    url: string;
    thumburl?: string;
    descriptionurl: string;
    mime: string;
    width: number;
    height: number;
    size: number;
    extmetadata?: Record<string, { value?: string }>;
  }>;
};

function stripHtml(value: string | undefined) {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function acceptedLicense(metadata: Record<string, { value?: string }> | undefined) {
  const license = stripHtml(metadata?.LicenseShortName?.value).toLowerCase();
  return /(^| )(cc0|public domain|cc by|cc-by|cc by-sa|cc-by-sa)/.test(license);
}

function sourceDetails(page: CommonsPage) {
  const info = page.imageinfo?.[0];
  const metadata = info?.extmetadata;
  return {
    sourceUrl: info?.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`,
    author: stripHtml(metadata?.Artist?.value) || "Wikimedia Commons contributor",
    license: stripHtml(metadata?.LicenseShortName?.value) || "See source page",
    description: stripHtml(metadata?.ImageDescription?.value) || page.title.replace(/^File:/, ""),
  };
}

async function searchCommons(query: string) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "50",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "1600",
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: commonsHeaders,
  });
  if (!response.ok) throw new Error(`Commons search failed for ${query}: ${response.status}`);
  const data = (await response.json()) as { query?: { pages?: Record<string, CommonsPage> } };
  return Object.values(data.query?.pages ?? {});
}

async function uploadCommonsImage(url: string, options: UploadApiOptions) {
  await new Promise((resolve) => setTimeout(resolve, 1250));
  const response = await fetch(url, {
    headers: commonsHeaders,
  });
  if (!response.ok) throw new Error(`Unable to download Commons image: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 10 * 1024 * 1024) throw new Error("Commons image exceeds the 10 MB import limit.");
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) reject(error ?? new Error("Cloudinary returned no upload result."));
      else resolve(result);
    });
    Readable.from(bytes).pipe(stream);
  });
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are required.");
  }
  console.log("Resolving import administrator…");
  const [admin] = await db.select({ id: users.id }).from(users).where(eq(users.role, "admin")).limit(1);
  if (!admin) throw new Error("Seed an administrator before importing Commons references.");
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });

  for (const [categoryId, searches] of Object.entries(catalog) as Array<[CategoryId, readonly string[]]>) {
    console.log(`Preparing ${categoryId}…`);
    const [category] = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, categoryId)).limit(1);
    if (!category) throw new Error(`Missing category: ${categoryId}`);
    const [{ count: existingCount }] = await db.select({ count: drizzleSql<number>`count(*)::int` }).from(contentItems).where(and(eq(contentItems.categoryId, category.id), eq(contentItems.kind, "REFERENCE")));
    let remaining = Math.max(0, TARGET_PER_CATEGORY - existingCount);
    if (!remaining) { console.log(`${categoryId}: already has ${existingCount} references.`); continue; }
    const pages = (await Promise.all(searches.map(searchCommons))).flat();
    const unique = [...new Map(pages.map((page) => [page.pageid, page])).values()];
    let imported = 0;
    for (const page of unique) {
      if (!remaining) break;
      const info = page.imageinfo?.[0];
      if (!info || !/^image\/(jpeg|png|webp)$/i.test(info.mime) || !acceptedLicense(info.extmetadata)) continue;
      const slug = `commons-${categoryId}-${page.pageid}`;
      const [exists] = await db.select({ id: contentItems.id }).from(contentItems).where(eq(contentItems.slug, slug)).limit(1);
      if (exists) continue;
      const source = sourceDetails(page);
      try {
        const upload = await uploadCommonsImage(info.thumburl ?? info.url, {
          folder: `flyerhub/commons/${categoryId}`,
          public_id: `commons-${page.pageid}`,
          overwrite: false,
          resource_type: "image",
          tags: ["wikimedia-commons", "reference", categoryId],
          context: { source_url: source.sourceUrl, author: source.author, license: source.license },
        });
        const itemId = randomUUID();
        await db.transaction(async (tx) => {
          await tx.insert(contentItems).values({
            id: itemId,
            kind: "REFERENCE",
            title: page.title.replace(/^File:/, "").replace(/\.[a-z0-9]+$/i, ""),
            slug,
            description: `${source.description} Source: Wikimedia Commons. Credit: ${source.author}. License: ${source.license}.`,
            categoryId: category.id,
            authorId: admin.id,
            sourceUrl: source.sourceUrl,
            sourceAuthor: source.author,
            sourceLicense: source.license,
            dimensions: `${info.width} × ${info.height}px`,
            moderationStatus: "APPROVED",
            moderationNote: "Imported from Wikimedia Commons with verified free license.",
            reviewedBy: admin.id,
            reviewedAt: new Date(),
            publishedAt: new Date(),
          });
          await tx.insert(contentAssets).values({
            id: randomUUID(),
            contentItemId: itemId,
            role: "REFERENCE_IMAGE",
            cloudinaryPublicId: upload.public_id,
            cloudinaryVersion: upload.version,
            resourceType: "image",
            format: upload.format,
            mimeType: upload.format ? `image/${upload.format}` : info.mime,
            bytes: upload.bytes,
            deliveryType: "upload",
            publicUrl: upload.secure_url,
          });
        });
        imported += 1;
        remaining -= 1;
      } catch (error) {
        console.warn(`${categoryId}: skipped ${page.title}:`, error instanceof Error ? error.message : error);
      }
    }
    console.log(`${categoryId}: imported ${imported}; total references now ${existingCount + imported}/${TARGET_PER_CATEGORY}.`);
  }
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await pool.end(); });
