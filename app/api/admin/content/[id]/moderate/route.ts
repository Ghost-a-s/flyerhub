import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { moderateContent } from "@/lib/services/content";
import { moderationSchema } from "@/lib/validators";
export async function POST(request: NextRequest, { params }: { params: { id: string } }) { try { const admin = requireAdmin(await getCurrentUser()); const parsed = moderationSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid moderation payload", details: parsed.error.flatten() }, { status: 400 }); return NextResponse.json({ data: await moderateContent(admin.id, params.id, parsed.data.status, parsed.data.note) }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 }); } }
