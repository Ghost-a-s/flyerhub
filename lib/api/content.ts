import { api } from "./client";
export type ContentCard = {
  id: string;
  slug: string;
  kind: "PSD_TEMPLATE" | "REFERENCE" | "DESIGN_BRIEF";
  title: string;
  description: string;
  category: string;
  previewUrl: string | null;
  favorites: number;
  downloads: number;
  status: string;
  createdAt: string;
};
export type ContentDetail = ContentCard & {
  author: string;
  externalContactUrl: string | null;
  dimensions: string | null;
  softwareVersion: string | null;
  license: "PERSONAL" | "COMMERCIAL" | null;
  assets: { role: string; url: string | null }[];
};
export const contentKeys = {
  all: ["content"] as const,
  list: (params: Record<string, string | undefined>) =>
    ["content", "list", params] as const,
  detail: (slug: string) => ["content", "detail", slug] as const,
};
export async function fetchContent(
  params: Record<string, string | undefined> = {},
) {
  return (await api.get<{ data: ContentCard[] }>("/content", { params })).data
    .data;
}

export async function fetchContentBySlug(slug: string) {
  return (await api.get<{ data: ContentCard[] }>(`/content/${slug}`)).data.data;
}

export async function fetchContentByCategory(
  categorySlug: string,
  params: Record<string, string | undefined> = {},
) {
  return (
    await api.get<{ data: ContentCard[] }>(
      `/categories/${encodeURIComponent(categorySlug)}/content`,
      { params },
    )
  ).data.data;
}

export async function fetchContentDetail(slug: string) {
  return (await api.get<{ data: ContentDetail }>(`/content/${slug}`)).data.data;
}
export async function toggleFavorite(slug: string, active: boolean) {
  return active
    ? api.post(`/content/${slug}/favorite`)
    : api.delete(`/content/${slug}/favorite`);
}
