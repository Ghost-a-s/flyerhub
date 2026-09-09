import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Search } from "lucide-react";
import { FlyerGallery } from "@/components/flyer-gallery";

const popularCategories = [
  { name: "Church Flyers", slug: "church-flyers", templates: 12, image: "/church-flyers/Church Flyer.jpg" },
  { name: "Birthday Flyers", slug: "birthday-flyers", templates: 17, image: "/birthday-flyers/Birthday Flyer (1).jpg" },
  { name: "Business Flyers", slug: "business-flyers", templates: 24, image: "/business-flyers/Business Flyer.jpg" },
  { name: "Party Flyers", slug: "party-flyers", templates: 23, image: "/party-flyers/FLYER DESIGN.jpg" },
  { name: "Event Flyers", slug: "event-flyers", templates: 11, image: "/event-flyers/Ballers night.jpg" },
  { name: "Restaurant Flyers", slug: "restaurant-flyers", templates: 23, image: "/restaurant-flyers/Food Flyer Design.jpg" },
];
export default function HomePage() {
  return (
    <main className="overflow-hidden bg-white">
      <section className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_80%_28%,rgba(139,92,246,0.14),transparent_31%),radial-gradient(circle_at_8%_5%,rgba(99,102,241,0.1),transparent_26%)]" />
        <div className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(30rem,0.9fr)] lg:gap-16 lg:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">Premium creative marketplace</p>
            <h1 className="mt-5 font-display text-5xl font-bold tracking-[-0.06em] text-navy sm:text-6xl lg:text-7xl">
              Professional PSD <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Flyer Templates</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Download high-quality, fully editable Photoshop flyer templates for events, businesses, churches, parties, promotions and more.
            </p>
            <form action="/templates" method="get" className="mt-9 flex max-w-2xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(24,24,43,0.1)] focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
              <Search className="ml-3 shrink-0 text-slate-400" size={21} aria-hidden="true" />
              <input name="q" type="search" aria-label="Search PSD flyers" placeholder="Church flyer, birthday flyer, business flyer…" className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-navy outline-none placeholder:text-slate-400 sm:text-base" />
              <button type="submit" className="button-primary shrink-0 px-4 sm:px-5">Search</button>
            </form>
            <p className="mt-3 text-sm text-slate-400">Search PSD flyers…</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/templates" className="button-primary">
                Browse Flyers <ArrowRight size={17} />
              </Link>
              <Link href="/templates?sort=popular" className="button-quiet">
                Free Templates
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-indigo-600" /> PSD</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-indigo-600" /> Fully Editable</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-indigo-600" /> High Resolution</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-indigo-600" /> Print Ready</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end">
            <div className="absolute -inset-8 -z-10 rounded-full bg-violet-100/80 blur-3xl" />
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <FlyerPreview src="/church-flyers/Church Flyer.jpg" alt="Church flyer template" className="mt-8" priority />
              <FlyerPreview src="/birthday-flyers/Birthday Flyer (1).jpg" alt="Birthday flyer template" className="-mb-5" priority />
              <FlyerPreview src="/business-flyers/Business Flyer.jpg" alt="Business flyer template" className="-mt-2" />
              <FlyerPreview src="/event-flyers/Ballers night.jpg" alt="Event flyer template" className="mt-5" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page border-t border-line py-20 sm:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Explore by purpose</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.045em] text-navy sm:text-4xl">Popular Categories</h2>
            <p className="mt-3 max-w-xl text-slate-600">Find the right starting point for your next event, promotion, or campaign.</p>
          </div>
          <Link href="/categories" className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition hover:text-indigo-800">
            View all categories <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularCategories.map((category) => (
            <Link key={category.slug} href={`/templates?category=${category.slug}`} className="group relative min-h-64 overflow-hidden rounded-2xl bg-slate-950 shadow-[0_16px_35px_-22px_rgba(24,24,43,0.7)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-22px_rgba(79,70,229,0.6)]">
              <Image src={category.image} alt="" fill sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw" className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
                <div>
                  <h3 className="font-display text-xl font-bold tracking-[-0.03em]">{category.name}</h3>
                  <p className="mt-1 text-sm text-white/75">{category.templates} Templates</p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white group-hover:text-indigo-700"><ArrowUpRight size={17} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <div className="border-t border-line bg-[#fcfcff]"><FlyerGallery mode="trending" /></div>
      <FlyerGallery mode="latest" />
    </main>
  );
}

function FlyerPreview({ alt, className, priority = false, src }: { alt: string; className?: string; priority?: boolean; src: string }) {
  return (
    <div className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_18px_35px_-20px_rgba(24,24,43,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-20px_rgba(79,70,229,0.42)] ${className ?? ""}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 14rem, 42vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
    </div>
  );
}
