import type { Template } from "@/lib/data";

type Submission = Template & {
  submissionStatus: "PENDING" | "APPROVED" | "REJECTED";
};

type SubmissionStore = { items: Submission[] };
const globalStore = globalThis as typeof globalThis & {
  flyerhubSubmissions?: SubmissionStore;
};
const store = globalStore.flyerhubSubmissions ?? { items: [] };
globalStore.flyerhubSubmissions = store;

export function createSubmission(input: {
  title: string;
  description: string;
  author: string;
  categorySlug?: string;
  previewName: string;
  image?: string;
}) {
  const id = `submission-${Date.now()}`;
  const categorySlug = input.categorySlug || "church-flyers";
  const category =
    categorySlug
      .replace("-", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) + " Flyers";
  const submission: Submission = {
    id,
    slug: id,
    title: input.title,
    category,
    categorySlug,
    description: input.description,
    tags: ["PSD", "Contributor", "New"],
    image: input.image || "/church-flyers/Church%20Flyer.jpg",
    fileSize: "Uploaded file",
    dimensions: "Uploaded artwork",
    software: "Adobe Photoshop",
    license: "Commercial",
    isFree: true,
    downloads: 0,
    favorites: 0,
    date: "Sep 08, 2026",
    author: input.author,
    status: "PENDING",
    submissionStatus: "PENDING",
  };
  store.items.unshift(submission);
  return submission;
}

export function getSubmissions() {
  return store.items;
}
export function getApprovedSubmissions() {
  return store.items.filter((item) => item.submissionStatus === "APPROVED");
}
export function moderateSubmission(
  id: string,
  status: "APPROVED" | "REJECTED",
) {
  const item = store.items.find((submission) => submission.id === id);
  if (!item) return null;
  item.submissionStatus = status;
  item.status = status === "APPROVED" ? "APPROVED" : "PENDING";
  return item;
}
