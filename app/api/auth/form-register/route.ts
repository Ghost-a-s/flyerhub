import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
export async function POST(request: Request) {
  const form = await request.formData();
  const name = form.get("name"),
    email = form.get("email"),
    password = form.get("password");
  const login = new URL("/login", request.url);
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    login.searchParams.set("error", "Complete every field.");
    return NextResponse.redirect(login, 303);
  }
  const authRequest = new Request(
    new URL("/api/auth/sign-up/email", request.url),
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: new URL(request.url).origin,
        cookie: request.headers.get("cookie") ?? "",
      },
      body: new URLSearchParams({
        name,
        email,
        password,
        callbackURL: "/dashboard",
      }).toString(),
    },
  );
  const result = await auth.handler(authRequest);
  const body = (await result
    .clone()
    .json()
    .catch(() => null)) as { message?: string } | null;
  if (!result.ok) {
    login.searchParams.set(
      "error",
      body?.message ?? "Unable to create account.",
    );
    return NextResponse.redirect(login, 303);
  }
  const headers = new Headers(result.headers);
  headers.delete("location");
  return NextResponse.redirect(new URL("/dashboard", request.url), {
    status: 303,
    headers,
  });
}
