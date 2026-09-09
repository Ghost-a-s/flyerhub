import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { premiumWaitlist } from "@/db/schema";
import { premiumWaitlistSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const parsed = premiumWaitlistSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  await db
    .insert(premiumWaitlist)
    .values({ id: randomUUID(), email: parsed.data.email.toLowerCase() })
    .onConflictDoNothing();
  return NextResponse.json({ ok: true }, { status: 201 });
}
