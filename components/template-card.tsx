import Link from "next/link";
import { ArrowUpRight, Heart, Layers3 } from "lucide-react";
import type { Template } from "@/lib/data";
export function TemplateCard({ template }: { template: Template }) {
  return (
    <article className="group">
      <Link
        href={`/templates/${template.slug}`}
        className="relative block aspect-[1.22] overflow-hidden rounded-xl bg-mist"
      >
        <img
          src={template.image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-navy opacity-0 shadow-sm transition group-hover:opacity-100">
          <Heart size={16} />
        </span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1.5 text-[11px] font-bold text-navy opacity-0 transition group-hover:opacity-100">
          <Layers3 size={13} /> PSD
        </span>
        <span className="absolute left-3 top-3 rounded-md bg-[#dff8ed] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#14734b]">
          Free
        </span>
      </Link>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {template.category}
            </p>
            <h3 className="font-display text-lg font-bold text-navy transition group-hover:text-cobalt">
              {template.title}
            </h3>
          </div>
          <ArrowUpRight
            className="mt-1 text-slate-300 transition group-hover:text-cobalt"
            size={19}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          by {template.author} <span className="mx-1 text-slate-300">·</span>{" "}
          {template.downloads.toLocaleString()} downloads
        </p>
      </div>
    </article>
  );
}
