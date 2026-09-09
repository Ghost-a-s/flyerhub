import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isCloudinaryConfigured, uploadImageData } from "@/lib/storage";
import { getActivity, setActivity } from "@/lib/activity";
import { createSubmission } from "@/lib/submissions";
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  const body = (await request.json()) as {
    filename?: string;
    contentType?: string;
    title?: string;
    description?: string;
    previewName?: string;
    imageData?: string;
    categorySlug?: string;
  };
  if (!body.filename || !body.contentType)
    return NextResponse.json(
      { error: "filename and contentType are required" },
      { status: 400 },
    );
  const safeName = body.filename.replace(/[^a-z0-9._-]/gi, "-");
  const ownerId = user?.id ?? "local-user";
  const key = `private/psd/${ownerId}/${crypto.randomUUID()}-${safeName}`;
  const imageUrl = body.imageData
    ? await uploadImageData(body.imageData, `${ownerId}-${crypto.randomUUID()}`)
    : null;
  const submission = createSubmission({
    title: body.title || safeName.replace(/\.psd$/i, ""),
    description: body.description || "Contributor-submitted flyer template.",
    author: user?.name || "Local contributor",
    previewName: body.previewName || "preview",
    image: body.imageData,
    categorySlug: body.categorySlug,
  });
  const response = NextResponse.json({
    key,
    storage: isCloudinaryConfigured() ? "cloudinary" : "local",
    imageUrl: imageUrl ?? body.imageData ?? null,
    submissionId: submission.id,
  });
  const activity = getActivity();
  activity.submissions += 1;
  setActivity(response, activity);
  return response;
}
