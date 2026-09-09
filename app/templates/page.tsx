import { Filter, SlidersHorizontal } from "lucide-react";
import { templates } from "@/lib/data";
import { SearchBar } from "@/components/search-bar";
import { TemplateCard } from "@/components/template-card";

export default function TemplatesPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string };
}) {
  const query = searchParams.q?.toLowerCase() ?? "";
  const filtered = templates
    .filter((template) =>
      `${template.title} ${template.description} ${template.tags.join(" ")}`
        .toLowerCase()
        .includes(query),
    )
    .filter(
      (template) =>
        !searchParams.category ||
        template.categorySlug === searchParams.category,
    );
  const categoriesInResults = [
    ...new Set(filtered.map((template) => template.categorySlug)),
  ];
  const mixedResults = searchParams.category
    ? filtered
    : Array.from(
        {
          length: Math.max(
            ...categoriesInResults.map(
              (categorySlug) =>
                filtered.filter(
                  (template) => template.categorySlug === categorySlug,
                ).length,
            ),
            0,
          ),
        },
        (_, index) =>
          categoriesInResults
            .map(
              (categorySlug) =>
                filtered.filter(
                  (template) => template.categorySlug === categorySlug,
                )[index],
            )
            .filter(Boolean),
      ).flat();
  const ordered =
    searchParams.sort === "popular"
      ? [...mixedResults].sort((a, b) => b.downloads - a.downloads)
      : mixedResults;
  return (
    <main className="container-page py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow">The library</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
          Templates that earn their keep.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-500">
          Browse the collection of practical, editable PSD files made for real
          creative work.
        </p>
      </div>
      <div className="mt-9 flex flex-col gap-3 lg:flex-row">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex gap-2">
          <button className="button-quiet flex-1">
            <Filter size={16} /> Filters
          </button>
          <select
            defaultValue={searchParams.sort ?? "newest"}
            className="h-11 rounded-lg border border-line bg-white px-3 text-sm font-bold text-navy outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="popular">Most popular</option>
          </select>
        </div>
      </div>
      <div className="mt-10 flex items-center justify-between border-b border-line pb-4">
        <p className="text-sm font-bold text-slate-500">
          <span className="text-navy">{ordered.length}</span> templates{" "}
          {query && <>for “{searchParams.q}”</>}
        </p>
        <button className="flex items-center gap-2 text-sm font-bold text-slate-500 lg:hidden">
          <SlidersHorizontal size={16} /> Refine
        </button>
        <p className="hidden text-xs font-bold uppercase tracking-widest text-slate-400 lg:block">
          Showing curated results
        </p>
      </div>
      {ordered.length ? (
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ordered.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="font-display text-2xl font-bold text-navy">
            Nothing matched that search.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Try a broader term or explore a category.
          </p>
        </div>
      )}
    </main>
  );
}
