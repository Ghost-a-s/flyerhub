import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createContent, listContent } from "@/lib/services/content";
import { contentQuerySchema, createContentSchema } from "@/lib/validators";
export async function GET(request: NextRequest) {
  const parsed = contentQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid content query", details: parsed.error.flatten() },
      { status: 400 },
    );
  return NextResponse.json({ data: await listContent(parsed.data) });
}
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const parsed = createContentSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid submission", details: parsed.error.flatten() },
      { status: 400 },
    );
  try {
    const id = await createContent(user.id, parsed.data);
    return NextResponse.json({ id, status: "PENDING" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to save submission",
      },
      { status: 422 },
    );
  }
}
