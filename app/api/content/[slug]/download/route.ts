import { NextResponse } from "next/server";
export async function GET(_: Request, { params }: { params: { slug: string } }) { return NextResponse.json({ url: `/api/content/${params.slug}/download/file` }); }
