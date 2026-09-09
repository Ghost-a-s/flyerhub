"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

type Category = {
  slug: string;
  name: string;
  images: { filename: string; url: string; bytes: number }[];
};

export function AdminCategoryMedia() {
  const client = useQueryClient();
  const [selectedSlug, setSelectedSlug] = useState("church-flyers");
  const query = useQuery({
    queryKey: ["admin", "category-assets"],
    queryFn: async () => (await api.get<{ data: Category[] }>("/admin/category-assets")).data.data,
  });
  const remove = useMutation({
    mutationFn: ({ categorySlug, filename }: { categorySlug: string; filename: string }) =>
      api.delete("/admin/category-assets", { data: { categorySlug, filename } }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "category-assets"] }),
  });

  if (query.isLoading) return <p className="mt-8 text-sm text-slate-500">Loading category media…</p>;
  if (query.isError) return <p className="mt-8 text-sm text-destructive">Unable to load category media.</p>;

  const selected = query.data?.find((category) => category.slug === selectedSlug) ?? query.data?.[0];

  return (
    <section id="category-media" className="mt-10 rounded-2xl border p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Local category media</p>
          <h2 className="mt-2 font-display text-xl font-bold">Manage category images</h2>
          <p className="mt-1 text-sm text-slate-500">Removing an image is permanent.</p>
        </div>
        <select
          value={selected?.slug ?? ""}
          onChange={(event) => setSelectedSlug(event.target.value)}
          className="h-10 rounded-lg border bg-white px-3 text-sm font-medium capitalize"
        >
          {query.data?.map((category) => (
            <option key={category.slug} value={category.slug}>{category.name}</option>
          ))}
        </select>
      </div>

      {!selected?.images.length ? (
        <p className="mt-6 rounded-xl border border-dashed p-6 text-sm text-slate-500">No local images in this category.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {selected.images.map((image) => (
            <article key={image.filename} className="overflow-hidden rounded-xl border bg-white">
              <img src={image.url} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="min-w-0 truncate text-xs font-medium" title={image.filename}>{image.filename}</p>
                <button
                  type="button"
                  className="rounded-md p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                  aria-label={`Delete ${image.filename}`}
                  disabled={remove.isPending}
                  onClick={() => {
                    if (window.confirm(`Permanently delete ${image.filename}?`)) {
                      remove.mutate({ categorySlug: selected.slug, filename: image.filename });
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
