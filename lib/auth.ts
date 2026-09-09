import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { db } from "@/db";
import * as schema from "@/db/schema";

const appUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
const transporter = smtpConfigured ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: process.env.SMTP_SECURE === "true", auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined }) : null;
async function sendMail(to: string, subject: string, text: string) {
  if (!transporter || !process.env.SMTP_FROM) throw new Error("SMTP is not configured. Set SMTP_HOST and SMTP_FROM before enabling email authentication.");
  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, text });
}
export const auth = betterAuth({
  baseURL: appUrl, secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
  emailAndPassword: { enabled: true, requireEmailVerification: true, sendResetPassword: async ({ user, url }) => sendMail(user.email, "Reset your A.T password", `Reset your password: ${url}`) },
  emailVerification: { sendOnSignUp: true, sendOnSignIn: true, sendVerificationEmail: async ({ user, url }) => sendMail(user.email, "Verify your A.T account", `Verify your email: ${url}`) },
  plugins: [admin({ defaultRole: "user", adminRoles: ["admin"] })],
});
export type SessionUser = { id: string; name: string; email: string; role?: string };
export async function getCurrentUser(): Promise<SessionUser | null> {
  const { headers } = await import("next/headers"); const session = await auth.api.getSession({ headers: headers() });
  return session?.user ? { id: session.user.id, name: session.user.name, email: session.user.email, role: (session.user as { role?: string }).role } : null;
}
export function requireAdmin(user: SessionUser | null) { if (!user || user.role !== "admin") throw new Error("Admin access required"); return user; }
