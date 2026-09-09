import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const LOGIN_PATH = "/login";
const allowedCallbackPaths = new Set(["/dashboard", "/admin"]);

function loginRedirect(request: Request, error?: string) {
  const url = new URL(LOGIN_PATH, request.url);
  if (error) url.searchParams.set("error", error);
  return url;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const requestedCallback = formData.get("callbackURL");
  const callbackURL = typeof requestedCallback === "string" && allowedCallbackPaths.has(requestedCallback)
    ? requestedCallback
    : "/dashboard";

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.redirect(loginRedirect(request, "Enter your email and password."), 303);
  }

  const authRequest = new Request(new URL("/api/auth/sign-in/email", request.url), {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      origin: new URL(request.url).origin,
      cookie: request.headers.get("cookie") ?? "",
    },
    body: new URLSearchParams({ email, password, callbackURL }).toString(),
  });
  const authResponse = await auth.handler(authRequest);

  if (!authResponse.ok) {
    const body = await authResponse.clone().json().catch(() => null) as { message?: string } | null;
    return NextResponse.redirect(loginRedirect(request, body?.message ?? "Unable to sign in."), 303);
  }

  const result = await authResponse.clone().json().catch(() => null) as { user?: { role?: string } } | null;
  const destination = result?.user?.role === "admin" ? "/admin" : callbackURL;
  const headers = new Headers(authResponse.headers);
  headers.delete("location");
  return NextResponse.redirect(new URL(destination, request.url), { status: 303, headers });
}
