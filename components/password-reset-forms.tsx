"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const requestSchema = z.object({ email: z.string().email("Enter a valid email address.") });
const resetSchema = z.object({ password: z.string().min(8, "Use at least eight characters."), confirmation: z.string() }).refine((value) => value.password === value.confirmation, { message: "Passwords do not match.", path: ["confirmation"] });

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof requestSchema>>({ resolver: zodResolver(requestSchema), defaultValues: { email: "" } });
  const submit = async (values: z.infer<typeof requestSchema>) => {
    form.clearErrors("root");
    const result = await authClient.requestPasswordReset({ email: values.email, redirectTo: `${window.location.origin}/reset-password` });
    if (result.error) form.setError("root", { message: result.error.message ?? "Unable to send reset email." });
    else form.reset();
  };
  return <form onSubmit={form.handleSubmit(submit)} className="space-y-4"><label className="grid gap-2 text-sm font-medium">Email<input type="email" autoComplete="email" className="h-11 rounded-md border bg-background px-3" {...form.register("email")} /></label>{form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}{form.formState.errors.root && <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>}{form.formState.isSubmitSuccessful && <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">If an account uses that email, a password-reset link has been sent.</p>}<button className="button-primary h-11 w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Sending…" : "Send reset link"}</button><p className="text-center text-sm text-muted-foreground"><Link href="/login" className="font-semibold text-primary">Back to sign in</Link></p></form>;
}

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof resetSchema>>({ resolver: zodResolver(resetSchema), defaultValues: { password: "", confirmation: "" } });
  const submit = async (values: z.infer<typeof resetSchema>) => {
    if (!token) return;
    form.clearErrors("root");
    const result = await authClient.resetPassword({ newPassword: values.password, token });
    if (result.error) {
      form.setError("root", { message: result.error.message ?? "This reset link is invalid or has expired." });
      return;
    }
    router.replace("/login?notice=Password%20updated.%20You%20can%20now%20sign%20in.");
  };
  if (!token) return <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">This password-reset link is missing or invalid. Request a new one.</div>;
  return <form onSubmit={form.handleSubmit(submit)} className="space-y-4"><label className="grid gap-2 text-sm font-medium">New password<input type="password" autoComplete="new-password" className="h-11 rounded-md border bg-background px-3" {...form.register("password")} /></label><label className="grid gap-2 text-sm font-medium">Confirm new password<input type="password" autoComplete="new-password" className="h-11 rounded-md border bg-background px-3" {...form.register("confirmation")} /></label>{form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}{form.formState.errors.confirmation && <p className="text-sm text-destructive">{form.formState.errors.confirmation.message}</p>}{form.formState.errors.root && <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>}<button className="button-primary h-11 w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Updating…" : "Update password"}</button></form>;
}
