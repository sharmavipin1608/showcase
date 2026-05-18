# Portfolio Phase 1 — Mission Control Showcase

**Date:** 2026-05-18
**Status:** Approved

---

## Overview

A curated engineering portfolio dashboard with a "Mission Control Hybrid" aesthetic — GitHub dark palette, NASA-style status indicators, bento grid tile layout. Phase 1 is intentionally scoped: no automation, no dual-mode toggle, no webhooks. Just a fast, impressive, deployable showcase.

---

## Phase Roadmap

| Phase | Scope |
|-------|-------|
| **1 — Mission Control Showcase** | Curated bento grid, GitHub API metadata, manual config, Vercel deploy |
| **2 — GitHub Automation** | GitHub Topics drive status, webhook-triggered revalidation, clone data harvesting |
| **3 — Dual-Mode UI** | Executive / Engineer perspective toggle, Mermaid.js architecture diagrams |
| **4 — Advanced Features** | RAG chat interface, per-repo deep-dive pages, Recharts metrics |

---

## Phase 1 Specification

### Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Data:** GitHub REST API v3 + local `projects-config.json`
- **No additional dependencies** for Phase 1 (no Framer Motion, no Recharts, no DB)

### Data Flow

```
projects-config.json
       ↓
  page.tsx (React Server Component)
       ↓
  GitHub REST API — GET /repos/{owner}/{repo}   [revalidate: 3600]
       ↓
  Merged ProjectData[]
       ↓
  BentoGrid → ProjectTile(s)
```

- Server component fetches all repos in parallel (`Promise.all`)
- GitHub API responses cached by Next.js fetch with `next: { revalidate: 3600 }`
- `GITHUB_TOKEN` stored in Vercel environment variables — never exposed to client
- Vercel regenerates the page in the background every hour automatically

### Config Schema — `projects-config.json`

Lives at the repo root. Defines which projects appear, in what order, and with what overrides.

```json
{
  "repos": [
    {
      "owner": "string",           // required — GitHub username or org
      "repo": "string",            // required — repository name
      "status": "live | in-flight | discovery",  // required
      "url": "string",             // optional — hosted URL; falls back to GitHub homepage field
      "tags": ["string"],          // optional — e.g. ["open-source", "template", "featured"]
      "featured": true             // optional — gives tile a wider bento span (default: false)
    }
  ]
}
```

**Status definitions:**
- `live` — deployed and publicly accessible
- `in-flight` — actively in development
- `discovery` — idea/backlog, not yet started

**Tag conventions (Phase 1):**
- `open-source` — repo is public and accepting contributions
- `template` — repo is a reusable template others can clone

Note: `featured` is a separate boolean field (controls bento grid tile width), not a tag.

### GitHub API Data Pulled Per Repo

From `GET /repos/{owner}/{repo}`:

| Field | Used for |
|-------|----------|
| `description` | Tile subtitle |
| `language` | Language badge |
| `stargazers_count` | Star count display |
| `pushed_at` | "Last updated" label |
| `homepage` | Fallback URL if `url` not in config |
| `html_url` | Link to repo on GitHub |

### Component Tree

```
page.tsx (Server Component)
└── MissionControlHeader
└── BentoGrid
    └── ProjectTile (× n)
        ├── StatusBadge
        ├── TagPill (× n)
        └── [URL link if available]
```

**`MissionControlHeader`**
Top bar spanning full width. Left: `MISSION CONTROL` title in `#58a6ff`, spaced letters. Right: `$ status --all` in muted monospace + live project count. Border-bottom separates from grid.

**`BentoGrid`**
CSS grid, 3-column base, responsive (2-col tablet, 1-col mobile). Tiles with `featured: true` span 2 columns. Uses `gap-3` or `gap-4`.

**`ProjectTile`**
Dark card (`bg-[#0d1117]`, `border border-[#30363d]`, `rounded-lg`). Contents:
- Top row: `StatusBadge` (left) + language label (right, muted)
- Repo name in white monospace
- Description from GitHub (truncated to 2 lines)
- Tag pills row (if any tags)
- Bottom row: star count + last pushed + URL link (if available)

**`StatusBadge`**

| Status | Symbol | Color |
|--------|--------|-------|
| `live` | `● LIVE` | `#3fb950` (green) |
| `in-flight` | `◐ IN FLIGHT` | `#d29922` (amber) |
| `discovery` | `○ DISCOVERY` | `#6e7681` (grey) |

**`TagPill`**
Small rounded pill, `text-[10px]`. Blue tint (`bg-[#388bfd26] text-[#58a6ff]`) for all tags in Phase 1.

### Error Handling

- If GitHub API call fails for a repo, render the tile with config data only (name, status, tags, URL) and omit GitHub-sourced fields silently. No error thrown.
- If `GITHUB_TOKEN` is missing, Next.js fetch falls back to unauthenticated (60 req/hr limit). Log a warning at build time.
- If a repo in config doesn't exist or is private, skip it and log a warning — do not crash the page.

### Routing

Single route: `/` — the full dashboard. No sub-pages in Phase 1.

### Deployment

1. Push repo to GitHub
2. Connect to Vercel (import project)
3. Add `GITHUB_TOKEN` to Vercel environment variables
4. Deploy — Vercel builds and serves the App Router project

No custom build steps required.

### Out of Scope for Phase 1

- GitHub Topics-driven status (Phase 2)
- Webhooks / on-demand revalidation (Phase 2)
- Executive / Engineer mode toggle (Phase 3)
- Architecture diagrams / Mermaid.js (Phase 3)
- Clone/traffic metrics harvesting (Phase 2)
- Per-repo detail pages (Phase 4)
- Animations / Framer Motion (Phase 3+)
- RAG chat interface (Phase 4)
