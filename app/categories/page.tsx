import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/data";
export default function CategoriesPage() {
  return (
    <main className="container-page py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="eyebrow">Browse the library</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
          Start with a category.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-500">
          Focused collections for the kind of work you are making today.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group min-h-[220px] rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-cobalt hover:shadow-soft"
          >
            <div
              className={`grid h-11 w-11 place-items-center rounded-lg text-sm font-display font-bold ${category.tone}`}
            >
              {category.name
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </div>
            <div className="mt-14 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-navy group-hover:text-cobalt">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {category.note}
                </p>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-cobalt"
              />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
