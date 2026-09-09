import { boolean, index, integer, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const contentKindEnum = pgEnum("content_kind", ["PSD_TEMPLATE", "REFERENCE", "DESIGN_BRIEF"]);
export const moderationStatusEnum = pgEnum("moderation_status", ["PENDING", "APPROVED", "REJECTED"]);
export const assetRoleEnum = pgEnum("asset_role", ["PSD_SOURCE", "PREVIEW_IMAGE", "REFERENCE_IMAGE"]);
export const licenseEnum = pgEnum("license", ["PERSONAL", "COMMERCIAL"]);

export const users = pgTable("user", {
  id: text("id").primaryKey(), name: text("name").notNull(), email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(), image: text("image"), role: text("role").default("user").notNull(),
  banned: boolean("banned").default(false), banReason: text("ban_reason"), banExpires: timestamp("ban_expires", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({ roleIndex: index("user_role_idx").on(table.role) }));
export const sessions = pgTable("session", {
  id: text("id").primaryKey(), expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  ipAddress: text("ip_address"), userAgent: text("user_agent"), userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
}, (table) => ({ userIndex: index("session_user_idx").on(table.userId) }));
export const accounts = pgTable("account", {
  id: text("id").primaryKey(), accountId: text("account_id").notNull(), providerId: text("provider_id").notNull(), userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"), refreshToken: text("refresh_token"), idToken: text("id_token"), accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }), refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }), scope: text("scope"), password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({ providerAccount: uniqueIndex("account_provider_account_idx").on(table.providerId, table.accountId) }));
export const verifications = pgTable("verification", { id: text("id").primaryKey(), identifier: text("identifier").notNull(), value: text("value").notNull(), expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow() });

export const categories = pgTable("category", { id: text("id").primaryKey(), name: text("name").notNull(), slug: text("slug").notNull().unique(), description: text("description").notNull() });
export const tags = pgTable("tag", { id: text("id").primaryKey(), name: text("name").notNull().unique(), slug: text("slug").notNull().unique() });
export const contentItems = pgTable("content_item", {
  id: text("id").primaryKey(), kind: contentKindEnum("kind").notNull(), title: text("title").notNull(), slug: text("slug").notNull().unique(), description: text("description").notNull(),
  categoryId: text("category_id").notNull().references(() => categories.id), authorId: text("author_id").notNull().references(() => users.id), externalContactUrl: text("external_contact_url"),
  dimensions: text("dimensions"), softwareVersion: text("software_version"), license: licenseEnum("license"), moderationStatus: moderationStatusEnum("moderation_status").default("PENDING").notNull(), moderationNote: text("moderation_note"), reviewedBy: text("reviewed_by").references(() => users.id), reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  favoritesCount: integer("favorites_count").default(0).notNull(), downloadCount: integer("download_count").default(0).notNull(), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(), publishedAt: timestamp("published_at", { withTimezone: true }),
}, (table) => ({ catalogIndex: index("content_catalog_idx").on(table.kind, table.moderationStatus, table.createdAt), categoryIndex: index("content_category_idx").on(table.categoryId, table.moderationStatus) }));
export const contentAssets = pgTable("content_asset", { id: text("id").primaryKey(), contentItemId: text("content_item_id").notNull().references(() => contentItems.id, { onDelete: "cascade" }), role: assetRoleEnum("role").notNull(), cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(), cloudinaryVersion: integer("cloudinary_version"), resourceType: text("resource_type").notNull(), format: text("format"), mimeType: text("mime_type").notNull(), bytes: integer("bytes").notNull(), deliveryType: text("delivery_type").notNull(), publicUrl: text("public_url"), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull() }, (table) => ({ contentIndex: index("content_asset_item_idx").on(table.contentItemId, table.role) }));
export const contentTags = pgTable("content_tag", { contentItemId: text("content_item_id").notNull().references(() => contentItems.id, { onDelete: "cascade" }), tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }) }, (table) => ({ pk: primaryKey({ columns: [table.contentItemId, table.tagId] }) }));
export const favorites = pgTable("favorite", { userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), contentItemId: text("content_item_id").notNull().references(() => contentItems.id, { onDelete: "cascade" }), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull() }, (table) => ({ pk: primaryKey({ columns: [table.userId, table.contentItemId] }) }));
export const downloads = pgTable("download", { id: text("id").primaryKey(), userId: text("user_id").references(() => users.id), contentItemId: text("content_item_id").notNull().references(() => contentItems.id), assetId: text("asset_id").notNull().references(() => contentAssets.id), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull() }, (table) => ({ contentIndex: index("download_content_idx").on(table.contentItemId, table.createdAt) }));
