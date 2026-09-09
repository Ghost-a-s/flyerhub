import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function RegisterPage() {
  return (
    <main className="container-page flex min-h-[600px] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-xl font-bold text-navy">
            A.T PSD
          </Link>
          <h1 className="mt-8 font-display text-3xl font-bold text-navy">
            Make room for better work.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create a free account to save and download templates.
          </p>
        </div>
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
