"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { api, apiError } from "@/lib/api/client";

type Membership = { plan: "FREE" | "PRO" | "CREATOR"; status: string; currentPeriodEnd: string | null };

export default function SubscriptionPage() {
  const { data: session, isPending } = authClient.useSession();
  const membership = useQuery({ queryKey: ["membership"], queryFn: async () => (await api.get<{ data: Membership }>("/membership")).data.data, enabled: Boolean(session?.user) });
  if (isPending || membership.isLoading) return <main className="container-page py-16 text-slate-500">Loading membership…</main>;
  if (!session?.user) return <main className="container-page py-16"><h1 className="font-display text-3xl font-bold">Subscription</h1><Link href="/login" className="button-primary mt-6">Sign in</Link></main>;
  if (membership.isError) return <main className="container-page py-16 text-rose-600">{apiError(membership.error)}</main>;
  const plan = membership.data!;
  const isPro = plan.plan === "PRO" && plan.status === "ACTIVE";
  return <main className="container-page max-w-3xl py-12"><Link href="/dashboard" className="text-sm font-bold text-indigo-600">← Back to dashboard</Link><p className="eyebrow mt-7">Membership</p><h1 className="mt-3 font-display text-4xl font-bold">Your subscription</h1><section className="mt-8 rounded-2xl border bg-white p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-extrabold uppercase tracking-wider text-indigo-700">Current plan</p><h2 className="mt-2 font-display text-3xl font-bold">{isPro ? "FlyerHub Pro" : "Free"}</h2><p className="mt-3 text-slate-600">{isPro ? "Premium PSD downloads and commercial-use template access are active." : "Upgrade to unlock protected Premium PSD downloads."}</p></div><Crown className={isPro ? "text-indigo-600" : "text-slate-300"} size={30} /></div>{plan.currentPeriodEnd && <p className="mt-6 text-sm text-slate-500">Renews or expires: {new Date(plan.currentPeriodEnd).toLocaleDateString()}</p>}<Link href="/premium" className="button-primary mt-7">{isPro ? "View Premium" : "Upgrade to Pro"}</Link></section></main>;
}
