import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );
  return NextResponse.json({
    data: {
      templates: 18,
      approved: 16,
      pending: 2,
      users: 248,
      downloadsThisMonth: 12400,
      topCategory: "Social Media",
    },
  });
}
