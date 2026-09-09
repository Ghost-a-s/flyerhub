"use client";

import Link from "next/link";
import { Download, Eye, Heart, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api, apiError } from "@/lib/api/client";
import { contentKeys, fetchContent, toggleFavorite, type ContentCard } from "@/lib/api/content";

type GalleryMode = "trending" | "latest";
const latestFilters = [
  { label: "Latest", value: "latest", sort: "newest" },
  { label: "Most Downloaded", value: "downloaded", sort: "popular" },
  { label: "Popular", value: "popular", sort: "favorites" },
  { label: "Free", value: "free", sort: "newest" },
  { label: "Premium", value: "premium", sort: "popular" },
] as const;

export function FlyerGallery({ mode }: { mode: GalleryMode }) {
  const [activeFilter, setActiveFilter] = useState("latest");
  const sort = mode === "trending" ? "popular" : latestFilters.find((filter) => filter.value === activeFilter)?.sort ?? "newest";
  const query = useQuery({
    queryKey: contentKeys.list({ sort, limit: "12" }),
    queryFn: () => fetchContent({ sort, limit: "12" }),
  });
  const items = query.data?.filter((item) => {
    if (mode !== "latest") return true;
    if (activeFilter === "premium") return item.kind === "PSD_TEMPLATE";
    if (activeFilter === "free") return item.kind !== "PSD_TEMPLATE";
    return true;
  });

  return (
    <section className="container-page py-20 sm:py-24">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">{mode === "trending" ? "Curated this week" : "Fresh from FlyerHub"}</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.045em] text-navy sm:text-4xl">
            {mode === "trending" ? "Trending Flyers" : "Latest PSD Flyer Templates"}
          </h2>
        </div>
        {mode === "trending" ? (
          <Link href="/templates?sort=popular" className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition hover:text-indigo-800">View all <Eye size={16} /></Link>
        ) : (
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {latestFilters.map((filter) => (
              <button key={filter.label} type="button" onClick={() => setActiveFilter(filter.value)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${activeFilter === filter.value ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"}`}>
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {query.isLoading && <div className="grid min-h-64 place-items-center text-slate-500"><LoaderCircle className="mr-2 animate-spin" size={18} /> Loading flyers…</div>}
      {query.isError && <p className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{apiError(query.error)}</p>}
      {!query.isLoading && !query.isError && !items?.length && <p className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No matching flyers are available yet.</p>}
      {!!items?.length && <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">{items.map((item) => <FlyerCard key={item.id} item={item} />)}</div>}
    </section>
  );
}

function FlyerCard({ item }: { item: ContentCard }) {
  const [saved, setSaved] = useState(false);
  const favorite = useMutation({ mutationFn: () => toggleFavorite(item.slug, !saved), onSuccess: () => setSaved((value) => !value) });
  const isPsd = item.kind === "PSD_TEMPLATE";
  const type = isPsd ? "PSD" : item.kind === "REFERENCE" ? "REFERENCE" : "BRIEF";

  async function download() {
    if (!isPsd) return;
    const result = await api.get<{ url: string }>(`/content/${item.slug}/download`);
    window.location.assign(result.data.url);
  }

  return (
    <article className="group relative mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_15px_35px_-26px_rgba(24,24,43,0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-24px_rgba(79,70,229,0.45)]">
      <Link href={`/templates/${item.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
          {item.previewUrl ? <img src={item.previewUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-sm text-slate-400">Preview unavailable</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="absolute inset-x-4 bottom-4 flex translate-y-3 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-navy"><Eye size={15} /> View Template</span>
            {isPsd && <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white"><Download size={15} /> Download</span>}
          </div>
        </div>
      </Link>
      <button type="button" aria-label={saved ? "Remove from favorites" : "Add to favorites"} onClick={() => favorite.mutate()} disabled={favorite.isPending} className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105 ${saved ? "text-rose-500" : "text-slate-600"}`}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3"><span className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-indigo-600">{type}</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${isPsd ? "bg-violet-100 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>{isPsd ? "Premium" : "Free"}</span></div>
        <Link href={`/templates/${item.slug}`} className="mt-2 block font-display text-lg font-bold leading-snug tracking-[-0.03em] text-navy transition hover:text-indigo-600">{item.title}</Link>
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-500"><span>{formatDownloads(item.downloads)} Downloads</span>{isPsd && <button type="button" onClick={download} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"><Download size={14} /> Download</button>}</div>
      </div>
    </article>
  );
}

function formatDownloads(count: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(count || 0);
}
