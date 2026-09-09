"use client";
import { Check, X } from "lucide-react";
import { useState } from "react";
import type { Template } from "@/lib/data";

export function ModerationQueue({ templates }: { templates: Template[] }) {
  const [items, setItems] = useState(templates);
  const [message, setMessage] = useState("");

  async function moderate(templateId: string, status: "APPROVED" | "REJECTED") {
    const response = await fetch(
      `/api/admin/templates/${templateId}/moderate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );
    if (!response.ok) {
      setMessage("You must be signed in to moderate submissions.");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== templateId));
    setMessage(`Submission ${status.toLowerCase()}.`);
  }

  return (
    <>
      {items.length ? (
        items.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between gap-4 border-b border-line p-5 last:border-0"
          >
            <div>
              <p className="font-bold text-navy">{template.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                Submitted by {template.author} · awaiting review
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Approve submission"
                onClick={() => moderate(template.id, "APPROVED")}
                className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                aria-label="Reject submission"
                onClick={() => moderate(template.id, "REJECTED")}
                className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="p-5 text-sm text-slate-500">
          No submissions are waiting for review.
        </p>
      )}
      {message && (
        <p className="border-t border-line px-5 py-3 text-sm font-semibold text-slate-500">
          {message}
        </p>
      )}
    </>
  );
}
