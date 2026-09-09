import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to start Premium." }, { status: 401 });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const plan = process.env.PAYSTACK_PRO_PLAN_CODE;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL;
  if (!secret || !plan || !appUrl) {
    return NextResponse.json({ error: "Premium checkout is not configured yet. Join the waitlist to be notified." }, { status: 503 });
  }
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      plan,
      callback_url: `${appUrl}/premium?checkout=complete`,
      metadata: { userId: user.id, plan: "PRO" },
    }),
  });
  const payload = (await response.json()) as { status: boolean; message?: string; data?: { authorization_url?: string } };
  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    return NextResponse.json({ error: payload.message ?? "Unable to start checkout." }, { status: 502 });
  }
  return NextResponse.json({ url: payload.data.authorization_url });
}
