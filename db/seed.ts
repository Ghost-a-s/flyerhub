import "dotenv/config";
import { randomUUID } from "crypto";
import { readdirSync } from "fs";
import { join } from "path";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import { db, pool } from "./index";
import { auth } from "@/lib/auth";
import { categories, contentAssets, contentItems, tags, users } from "./schema";

const catalog = [
  "church-flyers",
  "birthday-flyers",
  "business-flyers",
  "party-flyers",
  "restaurant-flyers",
  "event-flyers",
];
const titleCase = (value: string) =>
  value
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 110);
async function main() {
  await db
    .insert(categories)
    .values(
      catalog.map((slug) => ({
        id: slug,
        slug,
        name: titleCase(slug),
        description: `Curated ${titleCase(slug).toLowerCase()} for designers.`,
      })),
    )
    .onConflictDoNothing();
  await db
    .insert(tags)
    .values(
      ["PSD", "Inspiration", "Editable", "Flyer"].map((name) => ({
        id: slugify(name),
        name,
        slug: slugify(name),
      })),
    )
    .onConflictDoNothing();
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password)
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required.");
  let [admin] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!admin) {
    await auth.api.signUpEmail({
      body: {
        name: "A.T Administrator",
        email,
        password,
        callbackURL: "/admin",
      },
    });
    [admin] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  }
  await db
    .update(users)
    .set({ role: "admin", emailVerified: true, updatedAt: new Date() })
    .where(eq(users.email, email));
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  )
    return console.warn(
      "Database taxonomy and admin seeded. Configure Cloudinary and rerun to import reference images.",
    );
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  const root = join(process.cwd(), "public");
  for (const categoryId of catalog)
    for (const file of readdirSync(join(root, categoryId)).filter((entry) =>
      /\.(jpe?g|png|webp)$/i.test(entry),
    )) {
      const slug = `${categoryId}-${slugify(file)}`;
      const [exists] = await db
        .select({ id: contentItems.id })
        .from(contentItems)
        .where(eq(contentItems.slug, slug))
        .limit(1);
      if (exists) continue;
      const upload = await cloudinary.uploader.upload(
        join(root, categoryId, file),
        {
          folder: `at-psd/public-media/seed/${categoryId}`,
          resource_type: "image",
          overwrite: false,
        },
      );
      const itemId = randomUUID();
      await db
        .insert(contentItems)
        .values({
          id: itemId,
          kind: "REFERENCE",
          title: titleCase(slugify(file)),
          slug,
          description: `Reference artwork in the ${titleCase(categoryId)} collection.`,
          categoryId,
          authorId: admin!.id,
          moderationStatus: "APPROVED",
          publishedAt: new Date(),
        });
      await db
        .insert(contentAssets)
        .values({
          id: randomUUID(),
          contentItemId: itemId,
          role: "REFERENCE_IMAGE",
          cloudinaryPublicId: upload.public_id,
          cloudinaryVersion: upload.version,
          resourceType: "image",
          format: upload.format,
          mimeType: `image/${upload.format}`,
          bytes: upload.bytes,
          deliveryType: "upload",
          publicUrl: upload.secure_url,
        });
    }
  console.log("Reference catalog seeded.");
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
