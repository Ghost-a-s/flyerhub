import { NextResponse } from "next/server";
import { getContentBySlug } from "@/lib/services/content";
export async function GET(
  _: Request,
  { params }: { params: { slug: string } },
) {
  const item = await getContentBySlug(params.slug);
  return item
    ? NextResponse.json({ data: item })
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
