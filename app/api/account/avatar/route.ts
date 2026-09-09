import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth";
import { isCloudinaryConfigured } from "@/lib/storage";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxAvatarBytes = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!isCloudinaryConfigured()) return NextResponse.json({ error: "Profile image uploads are not configured." }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get("image");
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size > maxAvatarBytes) {
    return NextResponse.json({ error: "Use a JPG, PNG, or WebP image up to 5 MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await new Promise<{ secure_url?: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `at-psd/avatars/${user.id}`, public_id: "avatar", overwrite: true, resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result ?? {})),
    );
    stream.end(buffer);
  });
  if (!uploaded.secure_url) return NextResponse.json({ error: "Unable to save profile picture." }, { status: 502 });
  return NextResponse.json({ url: uploaded.secure_url });
}
