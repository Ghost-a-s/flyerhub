import Link from "next/link";
import { ArrowRight, Check, Download, Sparkles } from "lucide-react";
import { categories, templates } from "@/lib/data";
import { SearchBar } from "@/components/search-bar";
import { TemplateCard } from "@/components/template-card";

export default function HomePage() {
  return (
    <main>
      <section className="overflow-hidden bg-[#f2f0ff]">
        <div className="container-page grid min-h-[580px] items-center gap-12 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
          <div>
            <div className="eyebrow flex items-center gap-2">
              <Sparkles size={15} /> The home of editable flyer design
            </div>
            <h1 className="mt-5 max-w-2xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-navy sm:text-6xl lg:text-[76px]">
              Professional PSD flyers.{" "}
              <span className="text-cobalt">Ready to customize.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">
              Download high-quality, fully editable Photoshop flyer templates
              for events, businesses, churches, parties, and more.
            </p>
            <div className="mt-8">
              <SearchBar large />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/templates" className="button-primary">
                Browse flyers <ArrowRight size={16} />
              </Link>
              <Link href="/templates?sort=free" className="button-quiet">
                Free templates
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-cobalt" /> 300 DPI print ready
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-cobalt" /> Fully editable
                layers
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-cobalt" /> Free downloads
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[510px]">
            <div className="absolute -right-5 -top-6 h-24 w-24 rounded-full border-[14px] border-cobalt/20" />
            <div className="relative aspect-[0.92] overflow-hidden rounded-2xl bg-navy shadow-2xl">
              <img
                src={templates[2].image}
                alt="Featured flyer template"
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                  Featured flyer template
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold">
                  Modern Church Sunday Service
                </h2>
                <p className="mt-2 text-sm text-blue-100">
                  Fully layered. Print ready. Easy to edit.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-6 rounded-xl border border-line bg-white px-4 py-3 shadow-soft">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                This month
              </p>
              <p className="mt-1 flex items-center gap-2 font-display text-xl font-bold text-navy">
                <Download size={17} className="text-cobalt" /> 12.4k downloads
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Trending this week</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy">
              Trending flyer templates
            </h2>
          </div>
          <Link
            href="/templates"
            className="hidden items-center gap-2 text-sm font-bold text-cobalt sm:flex"
          >
            View all templates <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {templates.slice(0, 4).map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
        <Link href="/templates" className="button-quiet mt-10 w-full sm:hidden">
          View all templates <ArrowRight size={17} />
        </Link>
      </section>
      <section className="border-y border-line bg-white">
        <div className="container-page py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Find your starting point</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy">
                Browse popular categories
              </h2>
            </div>
            <Link
              href="/categories"
              className="hidden items-center gap-2 text-sm font-bold text-cobalt sm:flex"
            >
              All categories <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group rounded-xl border border-line p-5 transition hover:-translate-y-0.5 hover:border-cobalt hover:shadow-soft"
              >
                <div
                  className={`grid h-10 w-10 place-items-center rounded-lg text-sm font-display font-bold ${category.tone}`}
                >
                  {category.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-navy group-hover:text-cobalt">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {category.note}
                </p>
                <p className="mt-5 text-xs font-bold text-slate-400">
                  {category.count} templates{" "}
                  <ArrowRight
                    className="ml-1 inline transition group-hover:translate-x-1"
                    size={14}
                  />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container-page py-20">
        <div className="grid items-center gap-10 rounded-2xl bg-navy px-7 py-10 text-white sm:px-12 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
              For every kind of creator
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Make something people remember.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100">
              Join FlyerHub and get access to professional, editable designs
              that make every idea look its best.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-navy transition hover:bg-blue-50"
          >
            Create free account <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
