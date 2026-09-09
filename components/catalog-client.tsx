"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { contentKeys, fetchContent, fetchContentByCategory } from "@/lib/api/content";
import { apiError } from "@/lib/api/client";

export function CatalogClient({ categorySlug }: { categorySlug?: string }) {
  const query = useQuery({
    queryKey: contentKeys.list({ category: categorySlug }),
    queryFn: () =>
      categorySlug ? fetchContentByCategory(categorySlug) : fetchContent(),
  });
  if (query.isLoading)
    return (
      <div className="grid min-h-64 place-items-center text-muted-foreground">
        Loading the library…
      </div>
    );
  if (query.isError)
    return (
      <div className="rounded-lg border border-destructive/30 p-6 text-destructive">
        {apiError(query.error)}
      </div>
    );
  if (!query.data?.length)
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        The library is ready for its first approved submission.
      </div>
    );
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {query.data.map((item) => (
        <Link
          key={item.id}
          href={`/templates/${item.slug}`}
          className="group overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="aspect-[4/3] bg-muted">
            {item.previewUrl ? (
              <img
                src={item.previewUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-xs text-muted-foreground">
                No preview
              </div>
            )}
          </div>
          <div className="space-y-2 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              {item.kind.replaceAll("_", " ")} · {item.category}
            </p>
            <h2 className="font-display text-lg font-bold">{item.title}</h2>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {item.description}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.downloads} downloads · {item.favorites} saves
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
