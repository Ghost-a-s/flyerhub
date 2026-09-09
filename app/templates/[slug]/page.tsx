import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Download,
  Heart,
  Layers3,
  Share2,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getTemplate, templates } from "@/lib/data";
import { TemplateCard } from "@/components/template-card";
import { FavoriteButton } from "@/components/favorite-button";
export function generateStaticParams() {
  return templates.map((template) => ({ slug: template.slug }));
}
export default function TemplateDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const template = getTemplate(params.slug);
  if (!template) notFound();
  return (
    <main className="container-page py-10 sm:py-14">
      <Link
        href="/templates"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cobalt"
      >
        <ArrowLeft size={16} /> Back to templates
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <div className="overflow-hidden rounded-2xl bg-mist">
            <img
              src={template.image}
              alt={template.title}
              className="aspect-[1.22] h-full w-full object-cover"
            />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-2">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-mist px-3 py-1.5 text-xs font-bold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              className="grid h-10 w-10 place-items-center rounded-lg border border-line text-slate-500 hover:border-cobalt hover:text-cobalt"
              aria-label="Share template"
            >
              <Share2 size={17} />
            </button>
          </div>
        </div>
        <div>
          <p className="eyebrow">{template.category}</p>
          <span className="mt-4 inline-flex rounded-md bg-[#dff8ed] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#14734b]">
            Free PSD download
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            {template.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            {template.description}
          </p>
          <p className="mt-5 text-sm text-slate-500">
            Created by{" "}
            <span className="font-bold text-navy">{template.author}</span>{" "}
            <span className="mx-2 text-slate-300">·</span> Updated{" "}
            {template.date}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 border-y border-line py-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                File size
              </p>
              <p className="mt-1 font-bold text-navy">{template.fileSize}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Canvas
              </p>
              <p className="mt-1 font-bold text-navy">{template.dimensions}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Software
              </p>
              <p className="mt-1 font-bold text-navy">{template.software}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                License
              </p>
              <p className="mt-1 font-bold text-navy">{template.license}</p>
            </div>
          </div>
          <div className="mt-7 flex gap-3">
            <Link
              href={`/api/templates/${template.slug}/download`}
              className="button-primary flex-1"
            >
              <Download size={18} /> Download PSD
            </Link>
            <FavoriteButton slug={template.slug} />
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Download size={14} className="text-cobalt" /> Free download ·{" "}
            {template.downloads.toLocaleString()} downloads
          </div>
          <div className="mt-8 rounded-xl bg-[#f1f6ff] p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-navy">
              <Layers3 size={17} className="text-cobalt" /> What&apos;s inside
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <Check size={15} className="mt-0.5 text-cobalt" /> Fully layered
                PSD with named groups
              </li>
              <li className="flex gap-2">
                <Check size={15} className="mt-0.5 text-cobalt" /> Smart objects
                for easy customization
              </li>
              <li className="flex gap-2">
                <Check size={15} className="mt-0.5 text-cobalt" /> Licensed for
                personal and commercial work
              </li>
            </ul>
          </div>
        </div>
      </div>
      <section className="mt-20 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-bold text-navy">
          You might also like
        </h2>
        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates
            .filter((item) => item.id !== template.id)
            .slice(0, 4)
            .map((item) => (
              <TemplateCard key={item.id} template={item} />
            ))}
        </div>
      </section>
    </main>
  );
}
