import { NextRequest, NextResponse } from "next/server";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";
import { getCurrentUser, requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const categoryFolders = {
  "church-flyers": "church-flyers",
  "birthday-flyers": "birthday-flyers",
  "business-flyers": "business-flyers",
  "party-flyers": "party-flyers",
  "restaurant-flyers": "restaurant-flyers",
  "event-flyers": "event-flyers",
} as const;

type CategorySlug = keyof typeof categoryFolders;
const imageExtension = /\.(?:jpe?g|png|webp)$/i;
const publicDirectory = path.join(process.cwd(), "public");

function getCategoryDirectory(categorySlug: string) {
  const folder = categoryFolders[categorySlug as CategorySlug];
  if (!folder) return null;
  return path.join(publicDirectory, folder);
}

export async function GET() {
  try {
    requireAdmin(await getCurrentUser());
    const categories = await Promise.all(
      Object.entries(categoryFolders).map(async ([slug, folder]) => {
        const directory = path.join(publicDirectory, folder);
        let entries: string[] = [];

        try {
          entries = await readdir(directory);
        } catch {
          entries = [];
        }

        const images = await Promise.all(
          entries
            .filter((filename) => imageExtension.test(filename))
            .sort((a, b) => a.localeCompare(b))
            .map(async (filename) => ({
              filename,
              url: `/${folder}/${encodeURIComponent(filename)}`,
              bytes: (await stat(path.join(directory, filename))).size,
            })),
        );

        return { slug, name: slug.replace(/-/g, " "), images };
      }),
    );

    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(await getCurrentUser());
    const body = (await request.json()) as {
      categorySlug?: string;
      filename?: string;
    };
    const directory = body.categorySlug
      ? getCategoryDirectory(body.categorySlug)
      : null;

    if (
      !directory ||
      !body.filename ||
      path.basename(body.filename) !== body.filename ||
      !imageExtension.test(body.filename)
    ) {
      return NextResponse.json({ error: "Invalid image request" }, { status: 400 });
    }

    const target = path.resolve(directory, body.filename);
    if (path.dirname(target) !== path.resolve(directory)) {
      return NextResponse.json({ error: "Invalid image request" }, { status: 400 });
    }

    await unlink(target);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to delete image" }, { status: 403 });
  }
}
