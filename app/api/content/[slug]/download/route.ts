import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recordDownload } from "@/lib/services/content";
import { createAuthenticatedDownloadUrl } from "@/lib/storage";
export async function GET(_: Request, { params }: { params: { slug: string } }) { try { const user = await getCurrentUser(); const asset = await recordDownload(user?.id ?? null, params.slug); return NextResponse.json({ url: createAuthenticatedDownloadUrl(asset.cloudinaryPublicId, asset.format) }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Download unavailable" }, { status: 404 }); } }
