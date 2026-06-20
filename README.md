# Frontier BioMed

Marketing landing page for **Frontier BioMed** — one platform that brings every supplier, pharmacy, and lab onto a single workspace for modern clinics.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, and a custom WebGL scroll-driven hero sequence.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion, GSAP, Lenis (smooth scroll) |
| Icons | lucide-react |
| Hero render | Custom WebGL2 frame-sequence renderer |

## Getting started

Requires **Node.js 18.18+** and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm extract-hero-frames` | Extract hero frames from `public/1.mp4` (see below) |

## Project structure

```
src/
  app/              # App Router entry (layout, page, globals.css)
  components/       # Section + UI components (Hero, Navbar, StorySection, …)
    ui/             # Reusable primitives (button, badge, faq-tabs, …)
  context/          # React context (WaitlistContext)
  hooks/            # Custom hooks (useNavTheme)
  lib/              # Content, assets, utils, hero-frame manifest
    webgl/          # WebGL scroll-sequence renderer
public/
  hero-frames/      # Extracted hero frames + manifest.json
scripts/            # Frame extraction / processing utilities
```

Page content (copy, nav links, FAQs, etc.) lives in `src/lib/content.ts`.

## Hero scroll sequence

The hero is a frame-by-frame animation rendered to a `<canvas>` via WebGL2
(`src/lib/webgl/scrollSequence.ts`). On load it autoplays in a loop; the moment
the user scrolls, playback hands off to scroll-linked scrubbing.

Frames are decoded from `public/1.mp4` into individual images plus a
`manifest.json` that the app reads at build time:

```bash
pnpm extract-hero-frames
```

Useful environment overrides (see `scripts/extract-hero-frames.sh`):

- `FORMAT` — `jpg` (default) or `png`
- `JPEG_QUALITY` — ffmpeg `-q:v`, `1` (best) … `31` (worst); default `2`
- `SCALE_WIDTH` — downscale width to shrink the preload payload (default: native)

`ffmpeg` must be installed for extraction.

## License

Private and proprietary. © Frontier BioMed LLC.
