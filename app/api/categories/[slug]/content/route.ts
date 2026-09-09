import { NextRequest, NextResponse } from "next/server";
import { listContent } from "@/lib/services/content";
import { contentQuerySchema } from "@/lib/validators";

/** Lists approved content whose category has the requested URL slug. */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const parsed = contentQuerySchema.safeParse({
    ...Object.fromEntries(request.nextUrl.searchParams),
    category: params.slug,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid content query", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  return NextResponse.json({ data: await listContent(parsed.data) });
}
