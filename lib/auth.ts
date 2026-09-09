import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { createElement, type ReactElement } from "react";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { PasswordResetEmail } from "@/emails/password-reset-email";

const appUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const asOrigin = (value?: string) => {
  if (!value) return undefined;
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
};
const configuredOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => asOrigin(origin.trim()))
  .filter((origin): origin is string => Boolean(origin));
const trustedOrigins = Array.from(new Set([
  asOrigin(appUrl),
  asOrigin(process.env.NEXT_PUBLIC_APP_URL),
  asOrigin(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
  ...configuredOrigins,
  ...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:*", "http://127.0.0.1:*"]),
].filter((origin): origin is string => Boolean(origin))));
const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
const transporter = smtpConfigured ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: process.env.SMTP_SECURE === "true", auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined, connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000 }) : null;
async function sendMail({ to, subject, text, template }: { to: string; subject: string; text: string; template: ReactElement }) {
  if (!transporter || !process.env.SMTP_FROM) throw new Error("SMTP is not configured. Set SMTP_HOST and SMTP_FROM before enabling email authentication.");
  const html = await render(template);
  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, text, html });
}
export const auth = betterAuth({
  baseURL: appUrl, trustedOrigins, secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
  emailAndPassword: { enabled: true, requireEmailVerification: false, sendResetPassword: async ({ user, url }) => sendMail({ to: user.email, subject: "Reset your FlyerHub password", text: `Reset your password: ${url}`, template: createElement(PasswordResetEmail, { appUrl, name: user.name, resetUrl: url }) }) },
  plugins: [admin({ defaultRole: "user", adminRoles: ["admin"] })],
});
export type SessionUser = { id: string; name: string; email: string; role?: string };
export async function getCurrentUser(): Promise<SessionUser | null> {
  const { headers } = await import("next/headers"); const session = await auth.api.getSession({ headers: headers() });
  return session?.user ? { id: session.user.id, name: session.user.name, email: session.user.email, role: (session.user as { role?: string }).role } : null;
}
export function requireAdmin(user: SessionUser | null) { if (!user || user.role !== "admin") throw new Error("Admin access required"); return user; }
