"use client";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleFavorite as updateFavorite } from "@/lib/api/content";

export function FavoriteButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleFavorite() {
    if (loading) return;
    setLoading(true);
    try {
      await updateFavorite(slug, saved);
      setSaved(!saved);
    } catch {
      // The detail page keeps the current state when a signed-out request fails.
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      className={`button-quiet px-3 ${saved ? "text-cobalt" : ""}`}
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      onClick={toggleFavorite}
      disabled={loading}
    >
      <Heart size={19} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
