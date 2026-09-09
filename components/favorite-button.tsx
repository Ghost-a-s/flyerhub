"use client";
import { Heart } from "lucide-react";
import { useState } from "react";

export function FavoriteButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleFavorite() {
    if (loading) return;
    setLoading(true);
    const response = await fetch(`/api/templates/${slug}/favorite`, {
      method: saved ? "DELETE" : "POST",
    });
    if (response.ok) setSaved(!saved);
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
