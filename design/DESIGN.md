# basecase design system

**"hacker terminal"** — techy, nerdy, confident. The product is a systematic
tool for a technical audience, and the design leans into that: everything
should feel like a well-configured dev environment, not a SaaS brochure.

Tokens live in [`tokens.css`](tokens.css) (CSS custom properties, `--bc-*`).
That file is the single source of truth; apps map tokens into their own
styling system rather than hardcoding values.

## Principles

1. **Dark-only.** The aesthetic is a committed choice, not a theme option.
   `color-scheme: dark`, background `--bc-base-950`.
2. **Mono is the brand.** Monospace for headings, labels, buttons, nav, and
   anything terminal-flavored. System sans (`--bc-font-sans`) for body
   paragraphs only — long-form mono is hard to read.
3. **Zero (or near-zero) JavaScript for marketing surfaces.** Motion is CSS
   only, and always disabled under `prefers-reduced-motion`.
4. **One joke per section, max.** Nerd humor is the voice, but it seasons the
   copy — it isn't the copy.

## Color

| Token | Value | Use |
| --- | --- | --- |
| `--bc-base-950` | `#0a0e14` | Page background |
| `--bc-base-900` | `#0d131c` | Panels, cards, terminal bodies |
| `--bc-base-800` | `#131a26` | Raised chrome: title bars, card headers |
| `--bc-base-700` | `#1d2736` | Borders |
| `--bc-base-600` | `#2b384c` | Strong/hover borders |
| `--bc-base-400` | `#55627a` | Faint text, decorations, dim terminal output |
| `--bc-base-300` | `#8b98ad` | Muted/secondary text |
| `--bc-base-200` | `#b7c1d1` | Body text |
| `--bc-base-100` | `#e6ebf2` | Headings, emphasis |
| `--bc-term-300..600` | greens | Prompts (`$`), success, primary actions. `500` is the primary button fill (dark text on it) |
| `--bc-glow-300..500` | cyans | Links, highlights, info accents, hover glow |
| `--bc-amber-400` | `#ffb454` | Warnings, `medium` difficulty, sparing accents |

Accent discipline: **green = act/succeed, cyan = learn/info, amber = caution.**
Don't mix roles. Red appears only in the terminal traffic lights
(`--bc-traffic-*`) and real error states.

Difficulty mapping (product-wide): easy → term green, medium → amber,
hard → traffic red.

## Typography

- Headings: mono, bold, tight tracking. Hero scale ~`text-6xl`, section
  headings `text-3xl`–`text-4xl`.
- Body: sans, `--bc-base-300` on dark, ~15–18px.
- Section labels: mono, small, term green, formatted as a code comment:
  `// features`, `// ship it`.
- Terminal text: mono 13–14px, `--bc-base-200`, with dim output in
  `--bc-base-400`.

## Motifs

These are the recognizable moves of the system. Reuse them rather than
inventing new ones.

- **Blueprint grid**: 34px square grid of `--bc-grid-line` lines over
  `--bc-base-950` (two `linear-gradient` background layers).
- **Radial glow**: a large blurred cyan (`--bc-glow-500` at ~15% alpha)
  ellipse behind hero content.
- **Terminal window**: `--bc-base-900` body, `--bc-base-800` title bar with
  the three traffic lights and a mono `user@host: path — shell` title,
  rounded `--bc-radius-lg`, border `--bc-base-700`. Content shows realistic
  commands: green `$` prompt, normal command text, dim output, amber/cyan
  data highlights, and a blinking block cursor on the last line.
- **File-tab card**: card with a slim header bar (code icon + a mono
  filename like `plan.config`, `schedule.cron`, `progress.log`) over the
  body. Hover: lift 4px, brighten border, cyan glow shadow.
- **Blinking cursor**: 2px-wide block in term green, `blink` keyframes with
  `steps(1)` at ~1.1s. Used in the wordmark and terminal demos.
- **Command buttons**: primary = `--bc-term-500` fill, dark text, green
  glow shadow; secondary = bordered `--bc-base-700` panel. Labels are
  commands: `$ start prepping`, `$ get-started`, `man basecase`.
- **Wordmark**: `~/basecase` — green `~/` prefix, light name, blinking
  cursor after.
- **Status/stat strips**: mono numbers in term green with muted labels.
- **Footer sign-off**: `[exit 0]` right-aligned.

## Voice & copy

- Product name is always lowercase: **basecase**.
- Nav/labels/buttons lowercase, command-flavored. Headings use normal
  sentence casing.
- CS-flavored humor, one per section: "so nothing you learn gets
  garbage-collected", "brute-forcing 2,000 problems is O(n!) on your
  sanity", "0 excuses left", "no O(n²) onboarding", "[exit 0]".
- Confident and direct. No exclamation-mark marketing. The reader is an
  engineer; talk to them like one.

## Accessibility

- Body text `--bc-base-300`+ on `--bc-base-950`/`900` keeps ≥ 4.5:1
  contrast; `--bc-base-400` is for decorative/dim text only.
- Primary buttons are dark-on-green (not white-on-green) for contrast.
- All animation respects `prefers-reduced-motion: reduce`.
- Decorative elements (traffic lights, cursors, glows) get
  `aria-hidden="true"`.

## Consuming the tokens

**Landing (Tailwind 4):** `landing/src/styles/global.css` imports
`design/tokens.css` and maps tokens with `@theme inline`, e.g.
`--color-term-500: var(--bc-term-500);` — then use normal utilities
(`bg-term-500`, `text-base-300`).

**App (React + Chakra), when ready:** import `design/tokens.css` once in
`main.tsx`, then reference tokens from the Chakra theme as plain CSS var
strings:

```ts
const theme = extendTheme({
  styles: { global: { body: { bg: "var(--bc-base-950)", color: "var(--bc-base-200)" } } },
  fonts: { heading: "var(--bc-font-mono)", body: "var(--bc-font-sans)" },
  colors: { term: { 500: "var(--bc-term-500)" } },
});
```

Never copy hex values into app code — always go through a token.
