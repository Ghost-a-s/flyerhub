import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage() {
  return (
    <main className="container-page flex min-h-[600px] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-xl font-bold text-navy">
            A.T PSD
          </Link>
          <h1 className="mt-8 font-display text-3xl font-bold text-navy">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Your next great starting point is waiting.
          </p>
        </div>
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
