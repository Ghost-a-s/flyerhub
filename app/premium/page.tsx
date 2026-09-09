import Link from "next/link";
import { PremiumPlans } from "@/components/premium-plans";

export default function PremiumPage() {
  return (
    <main className="container-page py-16">
      <div className="mx-auto max-w-5xl text-center">
        <p className="eyebrow">FlyerHub Premium</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">Professional PSD assets, ready when you are.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-slate-600">Start free today, then move to Pro for protected premium PSD downloads and commercial-ready flyer templates.</p>
      </div>
      <PremiumPlans />
      <div className="mt-8 text-center"><Link href="/templates" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Browse the free library</Link></div>
    </main>
  );
}
