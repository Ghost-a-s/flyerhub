import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { setFavorite } from "@/lib/services/content";
async function mutate(slug: string, active: boolean) { const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 }); try { await setFavorite(user.id, slug, active); return NextResponse.json({ ok: true, active }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update favorite" }, { status: 404 }); } }
export async function POST(_: Request, { params }: { params: { slug: string } }) { return mutate(params.slug, true); }
export async function DELETE(_: Request, { params }: { params: { slug: string } }) { return mutate(params.slug, false); }
