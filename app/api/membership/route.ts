import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getMembership } from "@/lib/services/membership";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const membership = await getMembership(user.id);
  return NextResponse.json({
    data: membership
      ? { plan: membership.plan, status: membership.status, currentPeriodEnd: membership.currentPeriodEnd }
      : { plan: "FREE", status: "ACTIVE", currentPeriodEnd: null },
  });
}
