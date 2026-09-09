"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
const authSchema = z.object({ name: z.string().trim().min(2).max(80).optional(), email: z.string().email(), password: z.string().min(8).max(128) });
type AuthValues = z.infer<typeof authSchema>;
export function AuthForm({ mode }: { mode: "login" | "register" | "admin" }) {
  const router = useRouter();
  const form = useForm<AuthValues>({ resolver: zodResolver(authSchema), defaultValues: { name: "", email: "", password: "" } });
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const submit = async (values: AuthValues) => {
    form.clearErrors("root");
    setNotice(null);
    const result = mode === "register"
      ? await authClient.signUp.email({ name: values.name ?? "", email: values.email, password: values.password, callbackURL: "/dashboard" })
      : await authClient.signIn.email({ email: values.email, password: values.password, callbackURL: mode === "admin" ? "/admin" : "/dashboard" });

    if (result.error) {
      if (mode === "login" && result.error.status === 403) {
        setVerificationEmail(values.email);
        setNotice("Verify your email before signing in. A verification link has been sent to your inbox.");
        return;
      }
      form.setError("root", { message: result.error.message ?? "Authentication failed." });
      return;
    }

    if (mode === "register") {
      setVerificationEmail(values.email);
      setNotice("Account created. Check your inbox and verify your email to finish signing in.");
      return;
    }

    router.push(mode === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  };

  const resendVerification = async () => {
    if (!verificationEmail) return;
    setResending(true);
    form.clearErrors("root");
    const result = await authClient.sendVerificationEmail({ email: verificationEmail, callbackURL: "/dashboard" });
    setResending(false);
    if (result.error) {
      form.setError("root", { message: result.error.message ?? "Unable to resend the verification email." });
      return;
    }
    setNotice("A new verification email is on its way. Check your inbox and spam folder.");
  };

  return <form onSubmit={form.handleSubmit(submit)} className="space-y-4">{mode === "register" && <label className="grid gap-2 text-sm font-medium">Name<input className="h-11 rounded-md border bg-background px-3" {...form.register("name")} />{form.formState.errors.name && <span className="text-xs text-destructive">{form.formState.errors.name.message}</span>}</label>}<label className="grid gap-2 text-sm font-medium">Email<input type="email" className="h-11 rounded-md border bg-background px-3" {...form.register("email")} />{form.formState.errors.email && <span className="text-xs text-destructive">{form.formState.errors.email.message}</span>}</label><label className="grid gap-2 text-sm font-medium">Password<input type="password" className="h-11 rounded-md border bg-background px-3" {...form.register("password")} />{form.formState.errors.password && <span className="text-xs text-destructive">{form.formState.errors.password.message}</span>}</label>{form.formState.errors.root && <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>}{notice && <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">{notice}</div>}<button className="button-primary h-11 w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}</button>{verificationEmail && <button type="button" className="button-quiet h-10 w-full" disabled={resending} onClick={resendVerification}>{resending ? "Sending verification email…" : "Resend verification email"}</button>}<p className="text-center text-sm text-muted-foreground">{mode === "register" ? <>Already registered? <Link className="font-semibold text-primary" href="/login">Sign in</Link></> : <>New to A.T? <Link className="font-semibold text-primary" href="/register">Create an account</Link></>}</p></form>;
}
