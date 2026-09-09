import { NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { contentItems, downloads, users } from "@/db/schema";
export async function GET() { try { requireAdmin(await getCurrentUser()); const [[content], [members], [downloadTotal], [pending]] = await Promise.all([db.select({ count: count() }).from(contentItems), db.select({ count: count() }).from(users), db.select({ count: count() }).from(downloads), db.select({ count: count() }).from(contentItems).where(eq(contentItems.moderationStatus, "PENDING"))]); return NextResponse.json({ data: { content: content.count, users: members.count, downloads: downloadTotal.count, pending: pending.count } }); } catch { return NextResponse.json({ error: "Admin access required" }, { status: 403 }); } }
