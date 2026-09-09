"use client";
import { ImagePlus, ShieldCheck, UploadCloud } from "lucide-react";
import { useState } from "react";
export default function ContributorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [previewType, setPreviewType] = useState("image/jpeg");
  const [previewData, setPreviewData] = useState("");
  return (
    <main className="container-page py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow">Contributor studio</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
          Put your files to work.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-500">
          Share useful, well-made templates with a community that understands
          the craft. Every submission is reviewed before it goes live.
        </p>
      </div>
      {submitted ? (
        <div className="mt-12 max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
          <ShieldCheck className="text-emerald-600" size={28} />
          <h2 className="mt-5 font-display text-2xl font-bold text-navy">
            Submission received.
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your template is now in the moderation queue. We will let you know
            when it is ready.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            setError("");
            if (!previewName || !previewData) {
              setError("Choose an image before submitting.");
              return;
            }
            fetch("/api/uploads/sign", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filename: previewName,
                contentType: previewType,
                title: form.get("title"),
                description: form.get("description"),
                previewName,
                imageData: previewData,
                categorySlug: "church-flyers",
              }),
            })
              .then((response) => {
                if (!response.ok) throw new Error("Sign in before uploading.");
                setSubmitted(true);
              })
              .catch((submissionError) => {
                setError(
                  submissionError instanceof Error
                    ? submissionError.message
                    : "Upload failed.",
                );
              });
          }}
          className="mt-10 max-w-2xl space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-navy">
              Template title
            </label>
            <input
              required
              name="title"
              className="h-12 w-full rounded-lg border border-line bg-white px-4 text-sm outline-none focus:border-cobalt"
              placeholder="e.g. Northline Brand System"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-navy">
              Description
            </label>
            <textarea
              required
              name="description"
              className="min-h-28 w-full rounded-lg border border-line bg-white p-4 text-sm outline-none focus:border-cobalt"
              placeholder="What makes this template useful?"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-white p-8 text-center transition hover:border-cobalt">
              <ImagePlus className="text-cobalt" size={24} />
              <span className="mt-3 text-sm font-bold text-navy">
                Add preview
              </span>
              <span className="mt-1 text-xs text-slate-400">
                Image files only · any size
              </span>
              <input
                required
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setPreviewName(file?.name ?? "");
                  setPreviewType(file?.type || "image/jpeg");
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () =>
                      setPreviewData(
                        typeof reader.result === "string" ? reader.result : "",
                      );
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {previewName && (
                <span className="mt-2 max-w-full truncate text-xs font-semibold text-cobalt">
                  {previewName}
                </span>
              )}
            </label>
          </div>
          {error && (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          )}
          <div className="rounded-xl bg-[#f1f6ff] p-4 text-sm leading-6 text-slate-600">
            <strong className="text-navy">Before you submit:</strong> only
            upload work you own or have permission to distribute. See our{" "}
            <a href="/licensing" className="font-bold text-cobalt">
              licensing policy
            </a>
            .
          </div>
          <button className="button-primary">
            <UploadCloud size={18} /> Submit for review
          </button>
        </form>
      )}
    </main>
  );
}
