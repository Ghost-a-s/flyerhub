import Link from "next/link";
import {
  BarChart3,
  Clock3,
  Download,
  FileText,
  Users,
} from "lucide-react";
import { templates } from "@/lib/data";
import { getActivity } from "@/lib/activity";
import { ModerationQueue } from "@/components/moderation-queue";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { getSubmissions } from "@/lib/submissions";
export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <main className="container-page flex min-h-[600px] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <p className="eyebrow text-center">FlyerHub administration</p>
          <h1 className="mt-3 text-center font-display text-3xl font-bold text-navy">Admin sign in</h1>
          <p className="mt-2 mb-8 text-center text-sm text-slate-500">Use your administrator credentials to manage the library.</p>
          <AuthForm mode="admin" />
        </div>
      </main>
    );
  }
    const queue = getSubmissions().filter((submission) => submission.submissionStatus === "PENDING");
  const stats = [
    { label: "Catalog templates", value: templates.length.toLocaleString(), icon: FileText },
    { label: "Pending review", value: queue.length.toLocaleString(), icon: Clock3 },
    { label: "Registered users", value: "1", icon: Users },
    { label: "Downloads this month", value: getActivity().downloads.length.toLocaleString(), icon: Download },
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
          <ModerationQueue templates={queue} />
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
