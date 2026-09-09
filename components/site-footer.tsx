import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-display text-xl font-bold text-navy">
            Flyer<span className="text-cobalt">Hub</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
            Professional PSD flyer templates. Ready to customize.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-navy">Explore</p>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <Link className="block hover:text-cobalt" href="/templates">
              All templates
            </Link>
            <Link className="block hover:text-cobalt" href="/categories">
              Categories
            </Link>
            <Link
              className="block hover:text-cobalt"
              href="/templates?sort=popular"
            >
              Popular this week
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-navy">For creators</p>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <Link className="block hover:text-cobalt" href="/contributor">
              Become a contributor
            </Link>
            <Link className="block hover:text-cobalt" href="/dashboard">
              Your dashboard
            </Link>
            <Link className="block hover:text-cobalt" href="/licensing">
              Licensing
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-navy">FlyerHub</p>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <Link className="block hover:text-cobalt" href="/copyright">
              Copyright
            </Link>
            <Link className="block hover:text-cobalt" href="/dmca">
              DMCA
            </Link>
            <Link className="block hover:text-cobalt" href="/admin">
              Admin
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 FlyerHub. All rights reserved.</span>
          <span>Built for thoughtful creative work.</span>
        </div>
      </div>
    </footer>
  );
}
