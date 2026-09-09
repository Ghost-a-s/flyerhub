import Link from "next/link";
import { ArrowRight, Download, Heart, Upload } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getActivity } from "@/lib/activity";
import { getTemplate } from "@/lib/data";
export default async function DashboardPage() {
  const user = await getCurrentUser();
  const activity = getActivity();
  const savedTemplates = activity.saved.map(getTemplate).filter(Boolean);
  return (
    <main className="container-page py-12 sm:py-16">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy">
            Welcome, {user?.name ?? "there"}.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Keep your references close and your momentum closer.
          </p>
        </div>
        <Link href="/contributor" className="button-primary">
          <Upload size={17} /> Upload a template
        </Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-white p-5">
          <Heart className="text-cobalt" size={20} />
          <p className="mt-5 text-3xl font-display font-bold text-navy">
            {activity.saved.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Saved templates</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-5">
          <Download className="text-cobalt" size={20} />
          <p className="mt-5 text-3xl font-display font-bold text-navy">
            {activity.downloads.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Downloads this year</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-5">
          <Upload className="text-cobalt" size={20} />
          <p className="mt-5 text-3xl font-display font-bold text-navy">
            {activity.submissions}
          </p>
          <p className="mt-1 text-sm text-slate-500">Contributor submissions</p>
        </div>
      </div>
      <section className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-navy">
            Recently saved
          </h2>
          <Link
            href="/favorites"
            className="flex items-center gap-2 text-sm font-bold text-cobalt"
          >
            See all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-7 rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center">
          {savedTemplates.length > 0 ? (
            <div className="grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {savedTemplates.slice(0, 4).map(
                (template) =>
                  template && (
                    <div key={template.id}>
                      <img
                        src={template.image}
                        alt={template.title}
                        className="aspect-[1.22] w-full rounded-xl object-cover"
                      />
                      <p className="mt-3 font-display font-bold text-navy">
                        {template.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {template.category}
                      </p>
                    </div>
                  ),
              )}
            </div>
          ) : (
            <>
              <Heart className="mx-auto text-slate-300" size={24} />
              <p className="mt-4 font-display text-xl font-bold text-navy">
                Nothing saved yet
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Save templates while browsing and they will appear here.
              </p>
              <Link href="/templates" className="button-primary mt-5">
                Browse flyers <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
