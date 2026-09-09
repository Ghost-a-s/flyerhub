import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export type Activity = {
  saved: string[];
  downloads: string[];
  submissions: number;
};

const emptyActivity: Activity = { saved: [], downloads: [], submissions: 0 };

export function getActivity(): Activity {
  const value = cookies().get("at-activity")?.value;
  if (!value) return emptyActivity;
  try {
    const activity = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    );
    return {
      saved: Array.isArray(activity.saved) ? activity.saved : [],
      downloads: Array.isArray(activity.downloads) ? activity.downloads : [],
      submissions: Number.isInteger(activity.submissions)
        ? activity.submissions
        : 0,
    };
  } catch {
    return emptyActivity;
  }
}

export function setActivity(response: NextResponse, activity: Activity) {
  response.cookies.set(
    "at-activity",
    Buffer.from(JSON.stringify(activity)).toString("base64url"),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    },
  );
}
