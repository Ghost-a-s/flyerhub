import * as React from "react";
import { AuthEmail } from "./auth-email";

export function PasswordResetEmail({ appUrl, name, resetUrl }: { appUrl: string; name: string; resetUrl: string }) {
  return <AuthEmail appUrl={appUrl} preview="Reset your FlyerHub password" heading={`Reset your password${name ? `, ${name}` : ""}`} text="We received a request to reset the password for your FlyerHub account. Use the secure link below to choose a new password." actionLabel="Reset password" url={resetUrl} />;
}
