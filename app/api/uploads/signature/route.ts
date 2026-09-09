import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createUploadSignature } from "@/lib/storage";
import { uploadIntentSchema } from "@/lib/validators";
export async function POST(request: NextRequest) { const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 }); const parsed = uploadIntentSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid upload intent", details: parsed.error.flatten() }, { status: 400 }); try { return NextResponse.json(createUploadSignature(user.id, parsed.data)); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Upload unavailable" }, { status:503 }); } }
