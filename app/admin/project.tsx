import Link from "next/link";
import {
  BarChart3,
  Check,
  Clock3,
  Download,
  FileText,
  Users,
  X,
} from "lucide-react";
export default function AdminPage() {
  const stats = [
    { label: "Catalog templates", value: "18", icon: FileText },
    { label: "Pending review", value: "2", icon: Clock3 },
    { label: "Registered users", value: "248", icon: Users },
    { label: "Downloads this month", value: "12.4k", icon: Download },
  ];
  return (
    <main className="container-page py-12 sm:py-16">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Admin workspace</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy">
            Keep the library healthy.
          </h1>
        </div>
        <Link href="/" className="text-sm font-bold text-cobalt">
          View public site
        </Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-line bg-white p-5"
          >
            <Icon size={19} className="text-cobalt" />
            <p className="mt-5 font-display text-3xl font-bold text-navy">
              {value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line p-5">
            <div>
              <h2 className="font-display text-xl font-bold text-navy">
                Moderation queue
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Review contributor submissions
              </p>
            </div>
            <BarChart3 className="text-cobalt" size={20} />
          </div>
          {["Cinder Social Pack", "Lumen Product Mockups"].map(
            (item, index) => (
              <div
                key={item}
                className="flex items-center justify-between gap-4 border-b border-line p-5 last:border-0"
              >
                <div>
                  <p className="font-bold text-navy">{item}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Submitted by {index ? "Olivia Park" : "Sam Rivera"} ·{" "}
                    {index + 1}d ago
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    aria-label="Approve submission"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    aria-label="Reject submission"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ),
          )}
        </section>
        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="font-display text-xl font-bold text-navy">
            Catalog health
          </h2>
          <div className="mt-7 space-y-5 text-sm">
            <div>
              <div className="flex justify-between font-bold text-navy">
                <span>Approved listings</span>
                <span>89%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-mist">
                <div className="h-2 w-[89%] rounded-full bg-cobalt" />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-navy">
                <span>Complete previews</span>
                <span>96%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-mist">
                <div className="h-2 w-[96%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-navy">
                <span>Commercial licenses</span>
                <span>72%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-mist">
                <div className="h-2 w-[72%] rounded-full bg-amber-500" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
