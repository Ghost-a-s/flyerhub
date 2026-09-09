import { CatalogClient } from "@/components/catalog-client";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="container-page py-12">
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
