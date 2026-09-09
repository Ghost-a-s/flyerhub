import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { activatePaystackProMembership, deactivatePaystackMembership } from "@/lib/services/membership";

function isValidSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!isValidSignature(rawBody, request.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const event = JSON.parse(rawBody) as {
    event: string;
    data?: {
      metadata?: { userId?: string; plan?: string };
      subscription?: { subscription_code?: string; next_payment_date?: string };
      subscription_code?: string;
    };
  };
  const subscriptionCode = event.data?.subscription?.subscription_code ?? event.data?.subscription_code;
  if (event.event === "charge.success" && event.data?.metadata?.userId && subscriptionCode) {
    await activatePaystackProMembership({
      userId: event.data.metadata.userId,
      subscriptionCode,
      currentPeriodEnd: event.data.subscription?.next_payment_date ? new Date(event.data.subscription.next_payment_date) : undefined,
    });
  }
  if (event.event === "subscription.disable" && subscriptionCode) {
    await deactivatePaystackMembership(subscriptionCode);
  }
  return NextResponse.json({ received: true });
}
