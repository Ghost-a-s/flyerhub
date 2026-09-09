"use client";

import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { api, apiError } from "@/lib/api/client";

const waitlistSchema = z.object({ email: z.string().email("Enter a valid email address.") });
type WaitlistValues = z.infer<typeof waitlistSchema>;

export function PremiumPlans() {
  const { data: session } = authClient.useSession();
  const form = useForm<WaitlistValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: session?.user.email ?? "" },
  });
  const waitlist = useMutation({
    mutationFn: (values: WaitlistValues) => api.post("/premium/waitlist", values),
    onSuccess: () => form.reset(),
  });
  const checkout = useMutation({
    mutationFn: async () => (await api.post<{ url: string }>("/premium/checkout")).data,
    onSuccess: ({ url }) => window.location.assign(url),
  });

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="rounded-3xl border border-line bg-white p-7">
        <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-500">Free</p>
        <h2 className="mt-3 font-display text-3xl font-bold">Start creating</h2>
        <p className="mt-3 text-slate-600">Explore public references, save favorites, and upload designs for review.</p>
        <ul className="mt-7 space-y-3 text-sm text-slate-700">
          {['Free content downloads', 'Favorites and collections', 'Submit designs for review'].map((feature) => <li key={feature} className="flex gap-2"><Check size={17} className="mt-0.5 text-indigo-600" />{feature}</li>)}
        </ul>
        <Link href="/templates" className="button-quiet mt-8">Browse free templates</Link>
      </section>

      <section className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50 to-white p-7 shadow-[0_20px_50px_-32px_rgba(79,70,229,0.5)]">
        <div className="flex items-center justify-between gap-4"><p className="text-sm font-extrabold uppercase tracking-[0.14em] text-indigo-700">FlyerHub Pro</p><Crown size={22} className="text-indigo-600" /></div>
        <h2 className="mt-3 font-display text-3xl font-bold">Premium PSD access</h2>
        <p className="mt-3 text-slate-600">Unlock premium, commercial-ready PSD templates with protected downloads.</p>
        <ul className="mt-7 space-y-3 text-sm text-slate-700">
          {['Premium PSD template downloads', 'Commercial-use template access', 'Priority downloads and collections'].map((feature) => <li key={feature} className="flex gap-2"><Check size={17} className="mt-0.5 text-indigo-600" />{feature}</li>)}
        </ul>
        {session?.user ? (
          <button type="button" className="button-primary mt-8" disabled={checkout.isPending} onClick={() => checkout.mutate()}>
            {checkout.isPending ? "Opening checkout…" : "Start Premium"}
          </button>
        ) : <Link href="/login?callbackUrl=/premium" className="button-primary mt-8">Sign in to start</Link>}
        {checkout.isError && <p className="mt-3 text-sm text-rose-600">{apiError(checkout.error)}</p>}
      </section>

      <section className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/50 p-7 lg:col-span-2">
        <p className="eyebrow">Early access</p>
        <h2 className="mt-3 font-display text-2xl font-bold">FlyerHub Premium is coming soon.</h2>
        <p className="mt-2 text-slate-600">Join the waitlist and we will let you know when Premium opens.</p>
        <form onSubmit={form.handleSubmit((values) => waitlist.mutate(values))} className="mt-5 flex max-w-lg flex-col gap-3 sm:flex-row">
          <input aria-label="Email address" type="email" placeholder="you@example.com" className="h-11 flex-1 rounded-xl border bg-white px-4 text-sm outline-none ring-indigo-200 focus:ring-2" {...form.register("email")} />
          <button className="button-primary" disabled={waitlist.isPending}>{waitlist.isPending ? "Joining…" : "Join waitlist"}</button>
        </form>
        {form.formState.errors.email && <p className="mt-2 text-sm text-rose-600">{form.formState.errors.email.message}</p>}
        {waitlist.isSuccess && <p className="mt-2 text-sm font-medium text-emerald-700">You are on the Premium waitlist.</p>}
        {waitlist.isError && <p className="mt-2 text-sm text-rose-600">{apiError(waitlist.error)}</p>}
      </section>
    </div>
  );
}
