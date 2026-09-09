import { NextResponse } from "next/server";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contentItems, downloads, favorites } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getMembership } from "@/lib/services/membership";
export async function GET() { const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 }); const [[downloadTotal], [favoriteTotal], recent, membership] = await Promise.all([db.select({ count: count() }).from(downloads).where(eq(downloads.userId, user.id)), db.select({ count: count() }).from(favorites).where(eq(favorites.userId, user.id)), db.select({ slug: contentItems.slug, title: contentItems.title, downloadedAt: downloads.createdAt }).from(downloads).innerJoin(contentItems, eq(downloads.contentItemId, contentItems.id)).where(eq(downloads.userId, user.id)).orderBy(desc(downloads.createdAt)).limit(6), getMembership(user.id)]); return NextResponse.json({ data: { downloads: downloadTotal.count, favorites: favoriteTotal.count, collections: 0, membership: membership ? "Pro" : "Free", recent } }); }
