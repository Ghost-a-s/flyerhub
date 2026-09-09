import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const accountSchema = z.object({ name: z.string().trim().min(2).max(80) });

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  return NextResponse.json({ data: user });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const parsed = accountSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a name with at least two characters." }, { status: 400 });
  const [updated] = await db
    .update(users)
    .set({ name: parsed.data.name, updatedAt: new Date() })
    .where(eq(users.id, user.id))
    .returning({ name: users.name, email: users.email });
  return NextResponse.json({ data: updated });
}
