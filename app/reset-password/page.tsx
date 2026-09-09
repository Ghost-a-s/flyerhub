import Link from "next/link";
import { ResetPasswordForm } from "@/components/password-reset-forms";

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  return <main className="container-page flex min-h-[600px] items-center justify-center py-16"><div className="w-full max-w-md"><div className="mb-8 text-center"><Link href="/" className="font-display text-xl font-bold text-navy">FlyerHub</Link><h1 className="mt-8 font-display text-3xl font-bold text-navy">Choose a new password</h1><p className="mt-2 text-sm text-slate-500">Use a strong password you have not used elsewhere.</p></div><ResetPasswordForm token={searchParams.token} /></div></main>;
}
