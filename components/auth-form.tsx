"use client";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function AuthForm({ mode }: { mode: "login" | "register" | "admin" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        const form = new FormData(event.currentTarget);
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: mode,
              email: form.get("email"),
              name: form.get("name"),
              password: form.get("password"),
            }),
          });
          const result = await response.json();
          if (!response.ok)
            throw new Error(result.error ?? "Authentication failed.");
          setSuccess(
            mode === "register"
              ? "Account created successfully."
              : "Signed in successfully.",
          );
          window.dispatchEvent(new Event("flyerhub-auth-changed"));
          router.push(result.user?.role === "ADMIN" ? "/admin" : "/dashboard");
        } catch (formError) {
          setError(
            formError instanceof Error
              ? formError.message
              : "Authentication failed.",
          );
        } finally {
          setLoading(false);
        }
      }}
      className="space-y-4"
    >
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
          Email address
        </label>
        <div className="flex h-12 items-center gap-3 rounded-lg border border-line bg-white px-3">
          <Mail size={17} className="text-slate-400" />
          <input
            required
            name="email"
            type="email"
            className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none"
            placeholder="you@example.com"
          />
        </div>
      </div>
      {mode === "register" && (
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
            Your name
          </label>
          <div className="flex h-12 items-center gap-3 rounded-lg border border-line bg-white px-3">
            <UserRound size={17} className="text-slate-400" />
            <input
              required
              name="name"
              className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none"
              placeholder="Alex Morgan"
            />
          </div>
        </div>
      )}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
          Password
        </label>
        <div className="flex h-12 items-center gap-3 rounded-lg border border-line bg-white px-3">
          <LockKeyhole size={17} className="text-slate-400" />
          <input
            required
            name="password"
            type="password"
            minLength={8}
            className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none"
            placeholder="8+ characters"
          />
        </div>
      </div>
      <button className="button-primary h-12 w-full" disabled={loading}>
        {loading
          ? "Working..."
          : mode === "login"
            ? "Sign in"
            : mode === "admin"
              ? "Admin sign in"
              : "Create account"}{" "}
        <ArrowRight size={17} />
      </button>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      {success && (
        <p className="text-sm font-semibold text-emerald-600">{success}</p>
      )}
      {mode === "admin" ? null : mode === "login" ? (
        <p className="text-center text-sm text-slate-500">
          New to A.T?{" "}
          <Link className="font-bold text-cobalt" href="/register">
            Create an account
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-bold text-cobalt" href="/login">
            Sign in
          </Link>
        </p>
      )}
    </form>
  );
}
