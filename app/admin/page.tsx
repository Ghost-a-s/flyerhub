"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { AuthForm } from "@/components/auth-form";
import Link from "next/link";
import {
  BarChart3,
  FileUp,
  FolderPlus,
  Images,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AdminManagement } from "@/components/admin-management";
import { AdminCategoryMedia } from "@/components/admin-category-media";
const actions = [
  {
    title: "Upload template",
    description: "PSD source, preview image, tags, dimensions and licensing.",
    href: "/contributor",
    icon: FileUp,
    live: true,
  },
  {
    title: "Moderate templates",
    description: "Review pending submissions and approve or reject listings.",
    href: "/admin#moderation",
    icon: ShieldCheck,
    live: true,
  },
  {
    title: "Manage catalog",
    description:
      "Edit template information, categories, and listing visibility.",
    href: "/templates",
    icon: FolderPlus,
    live: false,
  },
  {
    title: "Category media",
    description: "Review categories separately and remove local flyer images.",
    href: "/admin#category-media",
    icon: Images,
    live: true,
  },
  {
    title: "Manage users",
    description: "Review members, download activity, and creator accounts.",
    href: "/admin#users",
    icon: Users,
    live: false,
  },
  {
    title: "Analytics",
    description: "Track content, users, downloads, and moderation status.",
    href: "/admin#analytics",
    icon: BarChart3,
    live: true,
  },
];
export default function AdminPage() {
  const query = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => (await api.get("/admin/analytics")).data.data,
  });
  if (query.isError)
    return (
      <main className="container-page py-20">
        <div className="mx-auto max-w-md rounded-xl border p-7">
          <p className="eyebrow">Administration</p>
          <h1 className="mt-3 font-display text-3xl font-bold">
            Admin sign in
          </h1>
          <div className="mt-6">
            <AuthForm mode="admin" />
          </div>
        </div>
      </main>
    );
  if (query.isLoading)
    return (
      <main className="container-page py-20 text-muted-foreground">
        Loading administration…
      </main>
    );
  return (
    <main className="container-page py-12">
      <p className="eyebrow">Administration</p>
      <h1 className="mt-3 font-display text-4xl font-bold">
        Keep FlyerHub healthy.
      </h1>
      <div
        id="analytics"
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Object.entries(query.data).map(([label, value]) => (
          <div className="rounded-xl border bg-card p-5" key={label}>
            <p className="text-3xl font-bold">{String(value)}</p>
            <p className="mt-1 text-sm capitalize text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">Admin actions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {actions.map(({ title, description, href, icon: Icon, live }) => (
            <Link
              key={title}
              href={href}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <Icon size={20} className="text-indigo-600" />
              <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            </Link>
          ))}
        </div>
      </section>
      <AdminManagement />
      <AdminCategoryMedia />
    </main>
  );
}
