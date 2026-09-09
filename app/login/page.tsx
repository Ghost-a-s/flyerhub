import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage({ searchParams }: { searchParams?: { error?: string; notice?: string } }) {
  return (
    <main className="container-page flex min-h-[600px] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-xl font-bold text-navy">
            FlyerHub
          </Link>
          <h1 className="mt-8 font-display text-3xl font-bold text-navy">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Your next great starting point is waiting.
          </p>
        </div>
        {searchParams?.error && <p role="alert" className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{searchParams.error}</p>}
        {searchParams?.notice && <p className="mb-4 rounded-md border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">{searchParams.notice}</p>}
        <AuthForm mode="login" />
        <p className="mt-8 text-center text-xs leading-5 text-slate-400">
          By continuing, you agree to our{" "}
          <Link href="/licensing" className="underline">
            terms and licensing policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
