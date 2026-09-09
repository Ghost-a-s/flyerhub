"use client";
import Link from "next/link";
import { Heart, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { data: session } = authClient.useSession();
  const userName = session?.user.name ?? null;
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  async function signOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      setOpen(false);
    } finally {
      setSigningOut(false);
    }
  }
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur">
      <div className="container-page flex h-[72px] items-center justify-between gap-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#6e4cff] to-[#29b6f6] font-display text-lg font-bold text-white shadow-[0_6px_16px_rgba(91,75,220,0.25)]">
            F
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-navy">
            Flyer<span className="text-cobalt">Hub</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-slate-500 md:flex">
          <Link className="transition hover:text-navy" href="/templates">
            Browse Flyers
          </Link>
          <Link className="transition hover:text-navy" href="/categories">
            Categories
          </Link>
          <Link
            className="transition hover:text-navy"
            href="/templates?sort=popular"
          >
            Free Templates
          </Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/templates"
            aria-label="Search templates"
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-mist hover:text-navy"
          >
            <Search size={19} />
          </Link>
          <Link
            href="/favorites"
            aria-label="Favorites"
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-mist hover:text-navy"
          >
            <Heart size={19} />
          </Link>
          {userName ? (
            <>
              <Link
                href={isAdmin ? "/admin" : "/dashboard"}
                className="button-primary ml-1"
              >
                {isAdmin ? "Admin dashboard" : userName}
              </Link>
              <button
                type="button"
                className="button-quiet"
                onClick={signOut}
                disabled={signingOut}
              >
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="button-quiet ml-1">
                Sign in
              </Link>
              <Link href="/register" className="button-primary">
                Get started
              </Link>
            </>
          )}
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-navy md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-white px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-bold text-navy">
            <Link href="/templates" onClick={() => setOpen(false)}>
              Browse Flyers
            </Link>
            <Link href="/categories" onClick={() => setOpen(false)}>
              Categories
            </Link>
            <Link href="/templates?sort=popular" onClick={() => setOpen(false)}>
              Free Templates
            </Link>
            <div className="flex gap-2 pt-2">
              {userName ? (
                <>
                  <Link
                    href={isAdmin ? "/admin" : "/dashboard"}
                    className="button-primary flex-1"
                  >
                    {isAdmin ? "Admin dashboard" : userName}
                  </Link>
                  <button
                    type="button"
                    className="button-quiet flex-1"
                    onClick={signOut}
                    disabled={signingOut}
                  >
                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="button-quiet flex-1">
                    Sign in
                  </Link>
                  <Link href="/register" className="button-primary flex-1">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
