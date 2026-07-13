// Central site configuration for the basecase marketing site.

// Where the actual app lives. Overridable per-environment via PUBLIC_APP_URL
// (e.g. https://app.basecase.dev in production). Defaults to the local Vite
// dev server so `npm run dev` works out of the box.
export const APP_URL = import.meta.env.PUBLIC_APP_URL ?? "http://localhost:5173";

export const SITE = {
  name: "basecase",
  title: "basecase — interview prep that sticks",
  description:
    "basecase builds you a personalized LeetCode plan, schedules problems with spaced repetition, and tracks every attempt — so you walk into your interview ready.",
  url: "https://basecase.dev",
} as const;
