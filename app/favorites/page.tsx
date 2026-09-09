import Link from "next/link";
import { Heart } from "lucide-react";
import { templates } from "@/lib/data";
import { TemplateCard } from "@/components/template-card";
export default function FavoritesPage() {
  return (
    <main className="container-page py-14 sm:py-20">
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Heart size={14} /> Your collection
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy">
            Saved for later.
          </h1>
        </div>
        <Link href="/templates" className="button-quiet">
          Browse templates
        </Link>
      </div>
      <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {templates.slice(0, 3).map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </main>
  );
}
