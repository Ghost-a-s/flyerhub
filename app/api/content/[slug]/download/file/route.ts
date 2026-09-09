import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recordDownload } from "@/lib/services/content";
import { createAuthenticatedDownloadUrl } from "@/lib/storage";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const user = await getCurrentUser();
    const { asset, isPsd } = await recordDownload(user?.id ?? null, params.slug);
    const sourceUrl = isPsd ? createAuthenticatedDownloadUrl(asset.cloudinaryPublicId, asset.format) : asset.publicUrl;
    if (!sourceUrl) throw new Error("Download asset is unavailable.");
    const source = await fetch(sourceUrl);
    if (!source.ok || !source.body) throw new Error("Unable to retrieve download asset.");
    const extension = asset.format ?? (isPsd ? "psd" : "jpg");
    const filename = `${params.slug}.${extension}`.replace(/[^a-z0-9._-]/gi, "-");
    return new NextResponse(source.body, { headers: { "content-type": asset.mimeType, "content-disposition": `attachment; filename="${filename}"`, "cache-control": "private, no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Download unavailable" }, { status: 404 });
  }
}
