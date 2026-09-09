"use client";

import Link from "next/link";
import { Camera, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { api, apiError } from "@/lib/api/client";

const profileSchema = z.object({ name: z.string().trim().min(2, "Enter at least two characters.").max(80), image: z.any().optional() });
const passwordSchema = z.object({ currentPassword: z.string().min(1, "Enter your current password."), newPassword: z.string().min(8, "Use at least eight characters."), confirmPassword: z.string() }).refine((value) => value.newPassword === value.confirmPassword, { message: "New passwords do not match.", path: ["confirmPassword"] });
type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

function message(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return apiError(error);
}

export default function AccountSettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const profile = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), values: { name: session?.user.name ?? "", image: undefined } });
  const password = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" } });
  const saveProfile = useMutation({
    mutationFn: async (values: ProfileValues) => {
      let image = (session?.user as { image?: string | null } | undefined)?.image ?? undefined;
      const file = values.image?.[0] as File | undefined;
      if (file) {
        const data = new FormData();
        data.append("image", file);
        image = (await api.post<{ url: string }>("/account/avatar", data, { headers: { "Content-Type": "multipart/form-data" } })).data.url;
      }
      const result = await authClient.updateUser({ name: values.name, image });
      if (result.error) throw new Error(result.error.message ?? "Unable to update account.");
      return image ?? null;
    },
    onSuccess: (image) => { setPreview(image); queryClient.invalidateQueries(); },
  });
  const changePassword = useMutation({
    mutationFn: async (values: PasswordValues) => {
      const result = await authClient.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword, revokeOtherSessions: true });
      if (result.error) throw new Error(result.error.message ?? "Unable to change password.");
    },
    onSuccess: () => password.reset(),
  });
  useEffect(() => () => { if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);

  if (isPending) return <main className="container-page py-16 text-slate-500">Loading account…</main>;
  if (!session?.user) return <main className="container-page py-16"><h1 className="font-display text-3xl font-bold">Account settings</h1><Link href="/login" className="button-primary mt-6">Sign in</Link></main>;
  const avatar = preview ?? (session.user as { image?: string | null }).image;
  const imageField = profile.register("image");

  return <main className="container-page max-w-3xl py-12"><Link href="/dashboard" className="text-sm font-bold text-indigo-600">← Back to dashboard</Link><p className="eyebrow mt-7">Account</p><h1 className="mt-3 font-display text-4xl font-bold">Account settings</h1><section className="mt-8 rounded-2xl border bg-white p-6"><h2 className="font-display text-xl font-bold">Profile</h2><form onSubmit={profile.handleSubmit((values) => saveProfile.mutate(values))} className="mt-5 space-y-5"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-indigo-100 font-display text-xl font-bold text-indigo-700">{avatar ? <img src={avatar} alt="Profile" className="h-full w-full object-cover" /> : session.user.name.charAt(0).toUpperCase()}</div><label className="button-quiet cursor-pointer"><Camera size={16} />Choose picture<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" {...imageField} onChange={(event) => { imageField.onChange(event); const file = event.target.files?.[0]; if (file) setPreview(URL.createObjectURL(file)); }} /></label></div><p className="text-xs text-slate-500">Preview appears immediately. Save profile to upload the image.</p><label className="grid gap-2 text-sm font-bold">Display name<input className="h-11 rounded-xl border px-3" {...profile.register("name")} /></label>{profile.formState.errors.name && <p className="text-sm text-rose-600">{profile.formState.errors.name.message}</p>}{saveProfile.isError && <p className="text-sm text-rose-600">{message(saveProfile.error)}</p>}{saveProfile.isSuccess && <p className="text-sm font-medium text-emerald-700">Profile saved.</p>}<button className="button-primary" disabled={saveProfile.isPending}>{saveProfile.isPending ? <><LoaderCircle size={16} className="animate-spin" />Saving…</> : "Save profile"}</button></form></section><section className="mt-6 rounded-2xl border bg-white p-6"><h2 className="font-display text-xl font-bold">Change password</h2><form onSubmit={password.handleSubmit((values) => changePassword.mutate(values))} className="mt-5 space-y-4"><label className="grid gap-2 text-sm font-bold">Current password<input type="password" autoComplete="current-password" className="h-11 rounded-xl border px-3" {...password.register("currentPassword")} /></label><label className="grid gap-2 text-sm font-bold">New password<input type="password" autoComplete="new-password" className="h-11 rounded-xl border px-3" {...password.register("newPassword")} /></label><label className="grid gap-2 text-sm font-bold">Confirm new password<input type="password" autoComplete="new-password" className="h-11 rounded-xl border px-3" {...password.register("confirmPassword")} /></label>{Object.values(password.formState.errors).map((error) => <p key={error.message} className="text-sm text-rose-600">{error.message}</p>)}{changePassword.isError && <p className="text-sm text-rose-600">{message(changePassword.error)}</p>}{changePassword.isSuccess && <p className="text-sm font-medium text-emerald-700">Password changed. Other sessions have been signed out.</p>}<button className="button-primary" disabled={changePassword.isPending}>{changePassword.isPending ? "Changing password…" : "Change password"}</button></form></section></main>;
}
