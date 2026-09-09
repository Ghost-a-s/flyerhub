"use client";

import Link from "next/link";
import { ChevronLeft, Download, ImageIcon, LoaderCircle, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FavoriteButton } from "@/components/favorite-button";
import { contentKeys, fetchContentDetail } from "@/lib/api/content";
import { api, apiError } from "@/lib/api/client";

export function ContentDetailClient({ slug }: { slug: string }) {
  const query = useQuery({ queryKey: contentKeys.detail(slug), queryFn: () => fetchContentDetail(slug) });
  const [activePreview, setActivePreview] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (query.isLoading) return <div className="grid min-h-80 place-items-center text-slate-500"><LoaderCircle className="mr-2 animate-spin" size={18} /> Loading flyer…</div>;
  if (query.isError) return <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-destructive">{apiError(query.error)}</p>;

  if (!query.data) return <p className="text-slate-500">This flyer is no longer available.</p>;
  const item = query.data;
  const previews = [item.previewUrl, ...item.assets.map((asset) => asset.url)].filter((url): url is string => Boolean(url)).filter((url, index, list) => list.indexOf(url) === index);
  const isPsd = item.kind === "PSD_TEMPLATE";
  const specifications = [
    ["File Type", isPsd ? "PSD" : "Reference image"],
    ["Software", item.softwareVersion || (isPsd ? "Adobe Photoshop" : "Not specified")],
    ["Resolution", "High resolution"],
    ["Color Mode", isPsd ? "CMYK" : "As supplied"],
    ["Dimensions", item.dimensions || "Not specified by creator"],
    ["Smart Objects", isPsd ? "Yes" : "Not applicable"],
    ["Editable Text", isPsd ? "Yes" : "Not applicable"],
    ["Print Ready", isPsd ? "Yes" : "Reference only"],
  ];

  async function downloadAsset() {
    if (downloading) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const result = await api.get<{ url: string }>(`/content/${slug}/download`);
      setDownloading(false);
      window.location.assign(result.data.url);
    } catch (error) {
      setDownloadError(apiError(error));
      setDownloading(false);
    }
  }

  return (
    <article className="mx-auto max-w-7xl">
      <nav aria-label="Flyer navigation" className="mb-7 flex items-center justify-between border-b border-line pb-4">
        <Link href="/templates" className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-indigo-700">
          <ChevronLeft size={18} />
          Back to Browse Flyers
        </Link>
        <Link href="/categories" className="text-sm font-bold text-indigo-600 transition hover:text-indigo-800">Categories</Link>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-16">
        <section>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_24px_55px_-32px_rgba(24,24,43,0.55)]">
            {previews[activePreview] ? <img src={previews[activePreview]} alt={`${item.title} preview`} className="h-full w-full object-contain" /> : <div className="grid h-full place-items-center text-slate-400"><ImageIcon size={32} /></div>}
          </div>
          {previews.length > 1 && <div className="mt-4 flex gap-3 overflow-x-auto pb-1">{previews.map((preview, index) => <button type="button" key={preview} onClick={() => setActivePreview(index)} className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${activePreview === index ? "border-indigo-600" : "border-transparent hover:border-indigo-200"}`}><img src={preview} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" /></button>)}</div>}
        </section>

        <section className="lg:pt-3">
          <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-indigo-700">{isPsd ? "PSD Template" : item.kind.replaceAll("_", " ")}</span><span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${isPsd ? "bg-violet-100 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>{isPsd ? "Premium" : "Free"}</span></div>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-[-0.05em] text-navy sm:text-5xl">{item.title}</h1>
          <p className="mt-4 text-sm text-slate-500">Created by <span className="font-semibold text-navy">{item.author}</span></p>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-600"><span className="inline-flex items-center gap-1.5"><Star size={17} className="fill-amber-400 text-amber-400" /> New — not yet rated</span><span>{formatDownloads(item.downloads)} downloads</span></div>
          <button type="button" onClick={downloadAsset} disabled={downloading} className="button-primary mt-8 h-13 w-full text-base">{downloading ? <><LoaderCircle className="animate-spin" size={18} /> Preparing download…</> : <><Download size={18} /> {isPsd ? "Download PSD" : "Download Image"}</>}</button>
          {!isPsd && <p className="mt-3 text-sm text-indigo-800"><ShieldCheck className="mr-1 inline-block text-indigo-600" size={16} /> Public image download</p>}
          {downloadError && <p className="mt-3 text-sm text-destructive">{downloadError}</p>}
          <div className="mt-3 flex items-center gap-3"><FavoriteButton slug={slug} /><span className="text-sm font-semibold text-slate-700">Add to Favorites</span></div>
          <div className="mt-9 border-t border-line pt-8"><h2 className="font-display text-xl font-bold tracking-[-0.03em] text-navy">Specifications</h2><dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">{specifications.map(([label, value]) => <div key={label} className="border-b border-slate-100 pb-3"><dt className="text-slate-500">{label}</dt><dd className="mt-1 font-semibold text-navy">{value}</dd></div>)}</dl></div>
        </section>
      </div>
      <div className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <section><h2 className="font-display text-2xl font-bold tracking-[-0.04em] text-navy">About this flyer</h2><p className="mt-5 whitespace-pre-wrap leading-8 text-slate-600">{item.description}</p></section>
        <section className="rounded-2xl bg-slate-50 p-6"><h2 className="font-display text-xl font-bold tracking-[-0.03em] text-navy">What’s Included</h2><ul className="mt-5 space-y-3 text-sm text-slate-600">{isPsd ? <><li>• PSD source file</li><li>• Fonts information</li><li>• Preview image</li><li>• Readme file</li></> : <><li>• Public preview image</li><li>• Design reference details</li><li>• Creator attribution</li></>}</ul></section>
      </div>
    </article>
  );
}

function formatDownloads(count: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(count || 0);
}
