import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";

export async function getMembership(userId: string) {
  const rows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.updatedAt));
  const active = rows.find(
    (subscription) =>
      subscription.status === "ACTIVE" &&
      subscription.plan === "PRO" &&
      (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > new Date()),
  );
  return active ?? null;
}

export async function hasPremiumAccess(userId: string | null) {
  if (!userId) return false;
  return Boolean(await getMembership(userId));
}

export async function activatePaystackProMembership(input: {
  userId: string;
  subscriptionCode: string;
  currentPeriodEnd?: Date;
}) {
  const [existing] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.providerSubscriptionId, input.subscriptionCode))
    .limit(1);
  const values = {
    plan: "PRO" as const,
    status: "ACTIVE" as const,
    provider: "paystack",
    providerSubscriptionId: input.subscriptionCode,
    currentPeriodEnd: input.currentPeriodEnd,
    updatedAt: new Date(),
  };
  if (existing) {
    await db.update(subscriptions).set(values).where(eq(subscriptions.id, existing.id));
    return;
  }
  await db.insert(subscriptions).values({ id: randomUUID(), userId: input.userId, ...values });
}

export async function deactivatePaystackMembership(subscriptionCode: string) {
  await db
    .update(subscriptions)
    .set({ status: "CANCELED", updatedAt: new Date() })
    .where(eq(subscriptions.providerSubscriptionId, subscriptionCode));
}
