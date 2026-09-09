import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CatalogClient } from "@/components/catalog-client";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="container-page py-12">
      <nav aria-label="Category navigation" className="mb-7 flex items-center justify-between border-b border-line pb-4">
        <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-indigo-700">
          <ChevronLeft size={18} />
          Back to Categories
        </Link>
        <Link href="/templates" className="text-sm font-bold text-indigo-600 transition hover:text-indigo-800">Browse all flyers</Link>
      </nav>
      <p className="eyebrow">Category collection</p>
      <h1 className="mt-3 font-display text-4xl font-bold">
        Approved community content
      </h1>
      <div className="mt-8">
        <CatalogClient categorySlug={slug} />
      </div>
    </main>
  );
}
