import { and, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "@/db";
import {
  categories,
  contentAssets,
  contentItems,
  contentTags,
  downloads,
  favorites,
  tags,
  users,
} from "@/db/schema";
import { inspectUploadedAsset } from "@/lib/storage";
import type { createContentSchema, contentQuerySchema } from "@/lib/validators";
import type { z } from "zod";
import { hasPremiumAccess } from "@/lib/services/membership";

type CreateInput = z.infer<typeof createContentSchema>;
type QueryInput = z.infer<typeof contentQuerySchema>;
const toCard = (
  row: typeof contentItems.$inferSelect,
  category: string,
  previewUrl: string | null,
) => ({
  id: row.id,
  slug: row.slug,
  kind: row.kind,
  title: row.title,
  description: row.description,
  category,
  previewUrl,
  favorites: row.favoritesCount,
  downloads: row.downloadCount,
  status: row.moderationStatus,
  createdAt: row.createdAt,
});

export async function listContent(input: QueryInput) {
  const filters = [eq(contentItems.moderationStatus, "APPROVED")];
  if (input.kind) filters.push(eq(contentItems.kind, input.kind));
  if (input.category) filters.push(eq(categories.slug, input.category));
  if (input.q) filters.push(ilike(contentItems.title, `%${input.q}%`));
  const order =
    input.sort === "popular"
      ? desc(contentItems.downloadCount)
      : input.sort === "favorites"
        ? desc(contentItems.favoritesCount)
        : desc(contentItems.createdAt);
  const rows = await db
    .select({ item: contentItems, categoryName: categories.name })
    .from(contentItems)
    .innerJoin(categories, eq(contentItems.categoryId, categories.id))
    .where(and(...filters))
    .orderBy(order)
    .limit(input.limit);
  const ids = rows.map(({ item }) => item.id);
  const assets = ids.length
    ? await db
        .select()
        .from(contentAssets)
        .where(inArray(contentAssets.contentItemId, ids))
    : [];
  return rows.map(({ item, categoryName }) =>
    toCard(
      item,
      categoryName,
      assets.find(
        (asset) =>
          asset.contentItemId === item.id && asset.role !== "PSD_SOURCE",
      )?.publicUrl ?? null,
    ),
  );
}
export async function getContentBySlug(slug: string) {
  const [row] = await db
    .select({
      item: contentItems,
      categoryName: categories.name,
      authorName: users.name,
    })
    .from(contentItems)
    .innerJoin(categories, eq(contentItems.categoryId, categories.id))
    .innerJoin(users, eq(contentItems.authorId, users.id))
    .where(
      and(
        eq(contentItems.slug, slug),
        eq(contentItems.moderationStatus, "APPROVED"),
      ),
    )
    .limit(1);
  if (!row) return null;
  const assets = await db
    .select()
    .from(contentAssets)
    .where(eq(contentAssets.contentItemId, row.item.id));
  return {
    ...toCard(
      row.item,
      row.categoryName,
      assets.find((asset) => asset.role !== "PSD_SOURCE")?.publicUrl ?? null,
    ),
    author: row.authorName,
    externalContactUrl:
      row.item.kind === "DESIGN_BRIEF" ? row.item.externalContactUrl : null,
    dimensions: row.item.dimensions,
    softwareVersion: row.item.softwareVersion,
    license: row.item.license,
    assets: assets
      .filter((asset) => asset.role !== "PSD_SOURCE")
      .map((asset) => ({ role: asset.role, url: asset.publicUrl })),
  };
}
export async function createContent(authorId: string, input: CreateInput) {
  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, input.categoryId))
    .limit(1);
  if (!category) throw new Error("Selected category no longer exists.");
  const existing = await db
    .select({ id: contentItems.id })
    .from(contentItems)
    .where(eq(contentItems.slug, input.slug))
    .limit(1);
  if (existing.length) throw new Error("That URL slug is already in use.");
  const itemId = randomUUID();
  const inspected = await Promise.all(
    input.assets.map(async (asset) => ({
      role: asset.role,
      ...(await inspectUploadedAsset(asset.publicId, asset.role)),
    })),
  );
  await db.transaction(async (tx) => {
    await tx
      .insert(contentItems)
      .values({
        id: itemId,
        kind: input.kind,
        title: input.title,
        slug: input.slug,
        description: input.description,
        categoryId: category.id,
        authorId,
        externalContactUrl: input.externalContactUrl,
        dimensions: input.dimensions,
        softwareVersion: input.softwareVersion,
        license: input.license,
      });
    await tx
      .insert(contentAssets)
      .values(
        inspected.map((asset) => ({
          id: randomUUID(),
          contentItemId: itemId,
          ...asset,
        })),
      );
    if (input.tagIds.length)
      await tx
        .insert(contentTags)
        .values(input.tagIds.map((tagId) => ({ contentItemId: itemId, tagId })))
        .onConflictDoNothing();
  });
  return itemId;
}
export async function setFavorite(
  userId: string,
  slug: string,
  active: boolean,
) {
  const [item] = await db
    .select({ id: contentItems.id })
    .from(contentItems)
    .where(
      and(
        eq(contentItems.slug, slug),
        eq(contentItems.moderationStatus, "APPROVED"),
      ),
    )
    .limit(1);
  if (!item) throw new Error("Content not found.");
  await db.transaction(async (tx) => {
    if (active) {
      const added = await tx
        .insert(favorites)
        .values({ userId, contentItemId: item.id })
        .onConflictDoNothing()
        .returning();
      if (added.length)
        await tx
          .update(contentItems)
          .set({ favoritesCount: sql`${contentItems.favoritesCount} + 1` })
          .where(eq(contentItems.id, item.id));
    } else {
      const removed = await tx
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, userId),
            eq(favorites.contentItemId, item.id),
          ),
        )
        .returning();
      if (removed.length)
        await tx
          .update(contentItems)
          .set({
            favoritesCount: sql`greatest(${contentItems.favoritesCount} - 1, 0)`,
          })
          .where(eq(contentItems.id, item.id));
    }
  });
}
export async function moderateContent(
  adminId: string,
  id: string,
  status: "APPROVED" | "REJECTED",
  note?: string,
) {
  const [item] = await db
    .update(contentItems)
    .set({
      moderationStatus: status,
      moderationNote: note ?? null,
      reviewedBy: adminId,
      reviewedAt: new Date(),
      publishedAt: status === "APPROVED" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(contentItems.id, id))
    .returning();
  if (!item) throw new Error("Content not found.");
  return item;
}
export async function recordDownload(userId: string | null, slug: string) {
  const [item] = await db
    .select()
    .from(contentItems)
    .where(
      and(
        eq(contentItems.slug, slug),
        eq(contentItems.moderationStatus, "APPROVED"),
      ),
    )
    .limit(1);
  if (!item) throw new Error("Template not found.");
  if (item.accessTier === "PREMIUM" && !(await hasPremiumAccess(userId))) {
    throw new Error("Premium membership is required to download this template.");
  }
  const role = item.kind === "PSD_TEMPLATE" ? "PSD_SOURCE" : undefined;
  const [asset] = await db
    .select()
    .from(contentAssets)
    .where(
      role
        ? and(
            eq(contentAssets.contentItemId, item.id),
            eq(contentAssets.role, role),
          )
        : and(
            eq(contentAssets.contentItemId, item.id),
            sql`${contentAssets.role} <> 'PSD_SOURCE'`,
          ),
    )
    .limit(1);
  if (!asset) throw new Error("Download asset is unavailable.");
  await db.transaction(async (tx) => {
    await tx
      .insert(downloads)
      .values({
        id: randomUUID(),
        userId: userId ?? undefined,
        contentItemId: item.id,
        assetId: asset.id,
      });
    await tx
      .update(contentItems)
      .set({ downloadCount: sql`${contentItems.downloadCount} + 1` })
      .where(eq(contentItems.id, item.id));
  });
  return { asset, isPsd: item.kind === "PSD_TEMPLATE" };
}
