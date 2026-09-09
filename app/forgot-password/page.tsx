import Link from "next/link";
import { ForgotPasswordForm } from "@/components/password-reset-forms";

export default function ForgotPasswordPage() {
  return <main className="container-page flex min-h-[600px] items-center justify-center py-16"><div className="w-full max-w-md"><div className="mb-8 text-center"><Link href="/" className="font-display text-xl font-bold text-navy">FlyerHub</Link><h1 className="mt-8 font-display text-3xl font-bold text-navy">Reset your password</h1><p className="mt-2 text-sm text-slate-500">Enter your email and we will send you a secure reset link.</p></div><ForgotPasswordForm /></div></main>;
}
