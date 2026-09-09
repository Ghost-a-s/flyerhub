import { v2 as cloudinary } from "cloudinary";
import type { z } from "zod";
import type { uploadIntentSchema } from "./validators";

const configured = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (configured) cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
export function isCloudinaryConfigured() { return configured; }
export function createUploadSignature(userId: string, intent: z.infer<typeof uploadIntentSchema>) {
  if (!configured) throw new Error("Cloudinary is not configured.");
  const timestamp = Math.floor(Date.now() / 1000); const raw = intent.role === "PSD_SOURCE";
  const folder = `at-psd/${raw ? "private-psd" : "public-media"}/${userId}`;
  const params = { timestamp, folder, type: raw ? "authenticated" : "upload" };
  return { timestamp, folder, type: params.type, resourceType: raw ? "raw" : "image", signature: cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!), apiKey: process.env.CLOUDINARY_API_KEY!, cloudName: process.env.CLOUDINARY_CLOUD_NAME!, uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${raw ? "raw" : "image"}/upload` };
}
export async function inspectUploadedAsset(publicId: string, role: "PSD_SOURCE" | "PREVIEW_IMAGE" | "REFERENCE_IMAGE") {
  if (!configured) throw new Error("Cloudinary is not configured.");
  const raw = role === "PSD_SOURCE";
  const resource = await cloudinary.api.resource(publicId, { resource_type: raw ? "raw" : "image", type: raw ? "authenticated" : "upload" }) as { public_id: string; version?: number; format?: string; bytes: number; resource_type: string; type: string; secure_url?: string };
  const maxBytes = Number(process.env[raw ? "MAX_PSD_SIZE_MB" : "MAX_PREVIEW_SIZE_MB"] ?? (raw ? 1024 : 15)) * 1024 * 1024;
  if (resource.bytes > maxBytes) throw new Error("Uploaded file exceeds the configured size limit.");
  return { cloudinaryPublicId: resource.public_id, cloudinaryVersion: resource.version, format: resource.format, bytes: resource.bytes, resourceType: resource.resource_type, deliveryType: resource.type, publicUrl: raw ? null : resource.secure_url ?? null, mimeType: raw ? "image/vnd.adobe.photoshop" : `image/${resource.format ?? "jpeg"}` };
}
export function createAuthenticatedDownloadUrl(publicId: string, format?: string | null) {
  if (!configured) throw new Error("Cloudinary is not configured.");
  return cloudinary.utils.private_download_url(publicId, format ?? "psd", { resource_type: "raw", type: "authenticated", expires_at: Math.floor(Date.now() / 1000) + 300 });
}
