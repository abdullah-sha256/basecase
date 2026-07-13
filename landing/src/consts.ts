// Central site configuration for the basecase marketing site.

// Where the actual app lives. Overridable per-environment via PUBLIC_APP_URL
// (e.g. https://app.basecase.dev in production). Defaults to the local Vite
// dev server so `npm run dev` works out of the box.
export const APP_URL = import.meta.env.PUBLIC_APP_URL ?? "http://localhost:5173";

export const SITE = {
  name: "basecase",
  title: "basecase — your interview prep, compiled",
  description:
    "basecase builds a study plan around your strengths and weaknesses, schedules LeetCode problems daily against the forgetting curve, and logs every attempt.",
  url: "https://basecase.dev",
} as const;
