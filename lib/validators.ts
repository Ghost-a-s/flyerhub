import { z } from "zod";
export const contentKindSchema = z.enum(["PSD_TEMPLATE", "REFERENCE", "DESIGN_BRIEF"]);
export const assetRoleSchema = z.enum(["PSD_SOURCE", "PREVIEW_IMAGE", "REFERENCE_IMAGE"]);
export const contentAssetSchema = z.object({ publicId: z.string().min(4).max(300), role: assetRoleSchema });
export const createContentSchema = z.object({
  kind: contentKindSchema, title: z.string().trim().min(3).max(120), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(140),
  description: z.string().trim().min(20).max(5000), categoryId: z.string().min(1), tagIds: z.array(z.string().min(1)).max(12).default([]),
  externalContactUrl: z.string().url().max(500).optional(), dimensions: z.string().trim().max(80).optional(), softwareVersion: z.string().trim().max(80).optional(), license: z.enum(["PERSONAL", "COMMERCIAL"]).optional(), assets: z.array(contentAssetSchema).min(1).max(2),
}).superRefine((value, context) => {
  const roles = value.assets.map((asset) => asset.role);
  if (value.kind === "PSD_TEMPLATE" && (!roles.includes("PSD_SOURCE") || !roles.includes("PREVIEW_IMAGE"))) context.addIssue({ code: z.ZodIssueCode.custom, message: "PSD templates require a PSD source and preview image.", path: ["assets"] });
  if (value.kind !== "PSD_TEMPLATE" && !roles.includes("REFERENCE_IMAGE")) context.addIssue({ code: z.ZodIssueCode.custom, message: "Reference posts and design briefs require an image.", path: ["assets"] });
  if (value.kind === "DESIGN_BRIEF" && !value.externalContactUrl) context.addIssue({ code: z.ZodIssueCode.custom, message: "Design briefs require an external contact URL.", path: ["externalContactUrl"] });
});
export const contentQuerySchema = z.object({ q: z.string().trim().max(120).optional(), kind: contentKindSchema.optional(), category: z.string().max(80).optional(), sort: z.enum(["newest", "popular", "favorites"]).default("newest"), limit: z.coerce.number().int().min(1).max(48).default(24) });
export const moderationSchema = z.object({ status: z.enum(["APPROVED", "REJECTED"]), note: z.string().trim().max(500).optional() });
export const uploadIntentSchema = z.object({ kind: contentKindSchema, role: assetRoleSchema, filename: z.string().min(1).max(180), mimeType: z.string().min(3).max(120) }).superRefine((value, context) => {
  if (value.role === "PSD_SOURCE" && value.mimeType !== "image/vnd.adobe.photoshop" && !value.filename.toLowerCase().endsWith(".psd")) context.addIssue({ code: z.ZodIssueCode.custom, message: "PSD source uploads must be PSD files." });
  if (value.role !== "PSD_SOURCE" && !value.mimeType.startsWith("image/")) context.addIssue({ code: z.ZodIssueCode.custom, message: "Preview and reference uploads must be images." });
});
