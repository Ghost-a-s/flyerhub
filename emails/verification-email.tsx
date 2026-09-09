import * as React from "react";
import { AuthEmail } from "./auth-email";

export function VerificationEmail({ appUrl, name, verificationUrl }: { appUrl: string; name: string; verificationUrl: string }) {
  return <AuthEmail appUrl={appUrl} preview="Verify your FlyerHub account" heading={`Welcome${name ? `, ${name}` : ""}!`} text="Thanks for joining FlyerHub. Verify your email address to start saving references, downloading PSD templates, and sharing your own work." actionLabel="Verify email address" url={verificationUrl} />;
}
