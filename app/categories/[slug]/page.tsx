import Link from "next/link";
import { ArrowLeft, ExternalLink, Pin } from "lucide-react";
import { notFound } from "next/navigation";
import { categories, getCategory, templates } from "@/lib/data";
import { TemplateCard } from "@/components/template-card";
export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}
export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();
  const results = templates.filter(
    (template) => template.categorySlug === category.slug,
  );
  const pinterestSearches: Record<string, string> = {
    "church-flyers":
      "https://www.pinterest.com/search/pins/?q=church%20flyer%20design&rs=rs&source_id=rs_RnpRWd0g&top_pin_ids=35536284555936710&eq=&etslf=3757",
    "birthday-flyers": "birthday flyer",
    "business-flyers": "business flyer design",
  };
  const pinterestQuery = pinterestSearches[category.slug];
  const pinterestUrl = pinterestQuery?.startsWith("https://")
    ? pinterestQuery
    : `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(pinterestQuery ?? "flyer design")}`;
  return (
    <main className="container-page py-12 sm:py-16">
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cobalt"
      >
        <ArrowLeft size={16} /> All categories
      </Link>
      <div className="mt-9 max-w-2xl">
        <p className="eyebrow">Category / {category.name}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
          {category.name}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-500">
          {category.note} Explore the collection and find a system that fits
          your next project.
        </p>
      </div>
      <div className="mt-10 flex items-center justify-between border-b border-line pb-4">
        <p className="text-sm font-bold text-slate-500">
          <span className="text-navy">{category.count}</span> templates in this
          collection
        </p>
        <Link
          href={`/templates?category=${category.slug}`}
          className="text-sm font-bold text-cobalt"
        >
          View all <span aria-hidden>→</span>
        </Link>
      </div>
      <a
        href={pinterestUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-[#eadcf5] bg-[#fff8ff] p-5 transition hover:border-[#d8b9ed] hover:shadow-soft"
      >
        <span className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#e60023] text-white">
            <Pin size={19} fill="currentColor" />
          </span>
          <span>
            <span className="block text-sm font-bold text-navy">
              Explore more {category.name.toLowerCase()} on Pinterest
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              Browse the live source collection in a new tab.
            </span>
          </span>
        </span>
        <ExternalLink className="shrink-0 text-slate-400" size={18} />
      </a>
      <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </main>
  );
}
