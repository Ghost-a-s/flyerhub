"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function SearchBar({ large = false }: { large?: boolean }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push(
          `/templates${query ? `?q=${encodeURIComponent(query)}` : ""}` as any,
        );
      }}
      className={`flex w-full items-center gap-3 rounded-xl border border-line bg-white px-4 shadow-sm ${large ? "h-14 max-w-xl" : "h-11"}`}
    >
      <Search size={large ? 21 : 18} className="shrink-0 text-slate-400" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={
          large
            ? "Church flyer, birthday flyer, business flyer..."
            : "Search PSD flyers..."
        }
        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-navy outline-none placeholder:text-slate-400"
      />
      <button className="hidden rounded-lg bg-navy px-3 py-2 text-xs font-bold text-white sm:block">
        Search
      </button>
    </form>
  );
}
