# Portfolio Phase 1 — Mission Control Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a Next.js Mission Control dashboard that reads from `projects-config.json`, enriches each entry with GitHub API data, and renders a dark bento grid with status indicators and tag pills.

**Architecture:** Next.js App Router server component reads a curated `projects-config.json`, fetches `GET /repos/{owner}/{repo}` from the GitHub REST API in parallel for each entry (cached with `revalidate: 3600`), merges the results, and renders a responsive 3-column bento grid. `GITHUB_TOKEN` lives in Vercel environment variables — no client-side API calls.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS 3.3+, Vitest, React Testing Library, Vercel

---

## File Map

| File | Purpose |
|------|---------|
| `projects-config.json` | Curated repo list with status, URL, tags, featured flag |
| `.env.local` | Local dev secrets (gitignored) |
| `.env.example` | Documents required env vars |
| `lib/types.ts` | Shared TypeScript types |
| `lib/config.ts` | Read and validate `projects-config.json` |
| `lib/github.ts` | GitHub API fetch, error handling, data merge |
| `components/StatusBadge.tsx` | Coloured status indicator |
| `components/TagPill.tsx` | Small tag badge |
| `components/MissionControlHeader.tsx` | Top bar with title and live count |
| `components/ProjectTile.tsx` | Individual bento card |
| `components/BentoGrid.tsx` | Responsive CSS grid wrapper |
| `app/globals.css` | Tailwind directives |
| `app/layout.tsx` | Root layout, metadata |
| `app/page.tsx` | Server component — fetches data, renders grid |
| `lib/__tests__/config.test.ts` | Tests for config loader |
| `lib/__tests__/github.test.ts` | Tests for API client and merge logic |
| `components/__tests__/StatusBadge.test.tsx` | Tests for StatusBadge |
| `components/__tests__/TagPill.test.tsx` | Tests for TagPill |
| `components/__tests__/MissionControlHeader.test.tsx` | Tests for MissionControlHeader |
| `components/__tests__/ProjectTile.test.tsx` | Tests for ProjectTile |
| `vitest.config.ts` | Vitest config |
| `vitest.setup.ts` | Jest-dom matchers setup |

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 1: Run create-next-app inside the existing showcase directory**

From `/Users/vipin/Projects/showcase`:
```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --yes
```
When prompted about the existing directory, confirm you want to proceed.

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```
Expected: `ready - started server on 0.0.0.0:3000`. Open http://localhost:3000 and confirm the default Next.js page loads.

Kill the server with Ctrl+C.

- [ ] **Step 3: Commit scaffolding**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js app with Tailwind"
```

---

## Task 2: Set Up Vitest

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Create vitest config**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 3: Create vitest setup file**

Create `vitest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to package.json**

In `package.json`, add to the `"scripts"` object:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify vitest runs**

```bash
npm test
```
Expected: `No test files found` (exit 0 — no tests yet, that's fine).

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json package-lock.json
git commit -m "feat: add Vitest and React Testing Library"
```

---

## Task 3: Define TypeScript Types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create types file**

Create `lib/types.ts`:
```typescript
export type ProjectStatus = 'live' | 'in-flight' | 'discovery'

export interface RepoConfig {
  owner: string
  repo: string
  status: ProjectStatus
  url?: string
  tags?: string[]
  featured?: boolean
}

export interface ProjectsConfig {
  repos: RepoConfig[]
}

export interface GitHubRepoData {
  description: string | null
  language: string | null
  stargazers_count: number
  pushed_at: string
  homepage: string | null
  html_url: string
}

export interface ProjectData {
  owner: string
  repo: string
  status: ProjectStatus
  url: string | null
  tags: string[]
  featured: boolean
  description: string | null
  language: string | null
  stars: number | null
  pushedAt: string | null
  githubUrl: string | null
}
```

- [ ] **Step 2: Verify TypeScript accepts the types**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 4: Config Reader

**Files:**
- Create: `lib/config.ts`, `lib/__tests__/config.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `lib/__tests__/config.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('fs')
vi.mock('path', () => ({
  default: { join: vi.fn(() => '/fake/projects-config.json') },
}))

import { readFileSync } from 'fs'
import { loadProjectsConfig } from '../config'

describe('loadProjectsConfig', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns parsed config for valid input', () => {
    const config = { repos: [{ owner: 'alice', repo: 'my-app', status: 'live' }] }
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(config))
    expect(loadProjectsConfig()).toEqual(config)
  })

  it('throws if repos key is missing', () => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify({}))
    expect(() => loadProjectsConfig()).toThrow('"repos" array')
  })

  it('throws if owner is missing', () => {
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({ repos: [{ repo: 'x', status: 'live' }] })
    )
    expect(() => loadProjectsConfig()).toThrow('missing "owner"')
  })

  it('throws if repo name is missing', () => {
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({ repos: [{ owner: 'alice', status: 'live' }] })
    )
    expect(() => loadProjectsConfig()).toThrow('missing "repo"')
  })

  it('throws if status is invalid', () => {
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({ repos: [{ owner: 'alice', repo: 'x', status: 'bogus' }] })
    )
    expect(() => loadProjectsConfig()).toThrow('Invalid status "bogus"')
  })
})
```

- [ ] **Step 2: Run tests — verify they all fail**

```bash
npm test
```
Expected: FAIL with `Cannot find module '../config'`.

- [ ] **Step 3: Implement config loader**

Create `lib/config.ts`:
```typescript
import { readFileSync } from 'fs'
import path from 'path'
import type { ProjectsConfig } from './types'

const VALID_STATUSES = ['live', 'in-flight', 'discovery'] as const

export function loadProjectsConfig(): ProjectsConfig {
  const configPath = path.join(process.cwd(), 'projects-config.json')
  const raw = readFileSync(configPath, 'utf-8')
  const parsed = JSON.parse(raw) as ProjectsConfig

  if (!parsed.repos || !Array.isArray(parsed.repos)) {
    throw new Error('projects-config.json must have a "repos" array')
  }

  for (const entry of parsed.repos) {
    if (!entry.owner || typeof entry.owner !== 'string') {
      throw new Error(`Invalid repo config: missing "owner" in ${JSON.stringify(entry)}`)
    }
    if (!entry.repo || typeof entry.repo !== 'string') {
      throw new Error(`Invalid repo config: missing "repo" in ${JSON.stringify(entry)}`)
    }
    if (!VALID_STATUSES.includes(entry.status)) {
      throw new Error(
        `Invalid status "${entry.status}" for ${entry.owner}/${entry.repo}. Must be one of: ${VALID_STATUSES.join(', ')}`
      )
    }
  }

  return parsed
}
```

- [ ] **Step 4: Run tests — verify they all pass**

```bash
npm test
```
Expected: 5 passing tests in `lib/__tests__/config.test.ts`.

- [ ] **Step 5: Commit**

```bash
git add lib/config.ts lib/__tests__/config.test.ts
git commit -m "feat: add config reader with validation"
```

---

## Task 5: GitHub API Client

**Files:**
- Create: `lib/github.ts`, `lib/__tests__/github.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `lib/__tests__/github.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRepoData, mergeProjectData } from '../github'
import type { RepoConfig, GitHubRepoData } from '../types'

describe('fetchRepoData', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('returns shaped data on success', async () => {
    const mockPayload = {
      description: 'My repo',
      language: 'TypeScript',
      stargazers_count: 42,
      pushed_at: '2024-01-01T00:00:00Z',
      homepage: 'https://example.com',
      html_url: 'https://github.com/alice/my-repo',
    }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockPayload,
    } as Response)

    const result = await fetchRepoData('alice', 'my-repo')
    expect(result).toEqual({
      description: 'My repo',
      language: 'TypeScript',
      stargazers_count: 42,
      pushed_at: '2024-01-01T00:00:00Z',
      homepage: 'https://example.com',
      html_url: 'https://github.com/alice/my-repo',
    })
  })

  it('returns null on 404', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response)
    const result = await fetchRepoData('alice', 'missing')
    expect(result).toBeNull()
  })

  it('returns null on network error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network error'))
    const result = await fetchRepoData('alice', 'my-repo')
    expect(result).toBeNull()
  })

  it('returns null on non-404 error response', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response)
    const result = await fetchRepoData('alice', 'my-repo')
    expect(result).toBeNull()
  })
})

describe('mergeProjectData', () => {
  const config: RepoConfig = {
    owner: 'alice',
    repo: 'my-app',
    status: 'live',
    url: 'https://myapp.com',
    tags: ['open-source'],
    featured: true,
  }

  const github: GitHubRepoData = {
    description: 'A great app',
    language: 'TypeScript',
    stargazers_count: 10,
    pushed_at: '2024-06-01T00:00:00Z',
    homepage: 'https://github-homepage.com',
    html_url: 'https://github.com/alice/my-app',
  }

  it('prefers config url over github homepage', () => {
    expect(mergeProjectData(config, github).url).toBe('https://myapp.com')
  })

  it('falls back to github homepage when config url is absent', () => {
    const noUrl: RepoConfig = { owner: 'alice', repo: 'my-app', status: 'live' }
    expect(mergeProjectData(noUrl, github).url).toBe('https://github-homepage.com')
  })

  it('sets github fields to null when github data is null', () => {
    const result = mergeProjectData(config, null)
    expect(result.description).toBeNull()
    expect(result.stars).toBeNull()
    expect(result.language).toBeNull()
    expect(result.githubUrl).toBeNull()
  })

  it('defaults tags to empty array and featured to false when not set', () => {
    const minimal: RepoConfig = { owner: 'alice', repo: 'x', status: 'discovery' }
    const result = mergeProjectData(minimal, null)
    expect(result.tags).toEqual([])
    expect(result.featured).toBe(false)
  })

  it('maps all github fields correctly', () => {
    const result = mergeProjectData(config, github)
    expect(result.description).toBe('A great app')
    expect(result.language).toBe('TypeScript')
    expect(result.stars).toBe(10)
    expect(result.pushedAt).toBe('2024-06-01T00:00:00Z')
    expect(result.githubUrl).toBe('https://github.com/alice/my-app')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```
Expected: FAIL with `Cannot find module '../github'`.

- [ ] **Step 3: Implement GitHub client**

Create `lib/github.ts`:
```typescript
import type { RepoConfig, GitHubRepoData, ProjectData } from './types'

export async function fetchRepoData(owner: string, repo: string): Promise<GitHubRepoData | null> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.warn('[github] GITHUB_TOKEN not set — using unauthenticated requests (60 req/hr limit)')
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 3600 },
    })

    if (res.status === 404) {
      console.warn(`[github] Repo ${owner}/${repo} not found or private — skipping`)
      return null
    }

    if (!res.ok) {
      console.warn(`[github] Failed to fetch ${owner}/${repo}: ${res.status} ${res.statusText}`)
      return null
    }

    const data = await res.json()
    return {
      description: data.description ?? null,
      language: data.language ?? null,
      stargazers_count: data.stargazers_count ?? 0,
      pushed_at: data.pushed_at,
      homepage: data.homepage ?? null,
      html_url: data.html_url,
    }
  } catch (err) {
    console.warn(`[github] Network error fetching ${owner}/${repo}:`, err)
    return null
  }
}

export function mergeProjectData(config: RepoConfig, github: GitHubRepoData | null): ProjectData {
  return {
    owner: config.owner,
    repo: config.repo,
    status: config.status,
    url: config.url ?? github?.homepage ?? null,
    tags: config.tags ?? [],
    featured: config.featured ?? false,
    description: github?.description ?? null,
    language: github?.language ?? null,
    stars: github?.stargazers_count ?? null,
    pushedAt: github?.pushed_at ?? null,
    githubUrl: github?.html_url ?? null,
  }
}

export async function fetchAllProjects(repos: RepoConfig[]): Promise<ProjectData[]> {
  return Promise.all(
    repos.map(async (repoConfig) => {
      const github = await fetchRepoData(repoConfig.owner, repoConfig.repo)
      return mergeProjectData(repoConfig, github)
    })
  )
}
```

- [ ] **Step 4: Run tests — verify they all pass**

```bash
npm test
```
Expected: all tests in `lib/__tests__/github.test.ts` pass.

- [ ] **Step 5: Commit**

```bash
git add lib/github.ts lib/__tests__/github.test.ts
git commit -m "feat: add GitHub API client with error handling and merge logic"
```

---

## Task 6: StatusBadge Component

**Files:**
- Create: `components/StatusBadge.tsx`, `components/__tests__/StatusBadge.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `components/__tests__/StatusBadge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusBadge } from '../StatusBadge'

describe('StatusBadge', () => {
  it('renders ● LIVE for live status', () => {
    render(<StatusBadge status="live" />)
    expect(screen.getByText('● LIVE')).toBeInTheDocument()
  })

  it('renders ◐ IN FLIGHT for in-flight status', () => {
    render(<StatusBadge status="in-flight" />)
    expect(screen.getByText('◐ IN FLIGHT')).toBeInTheDocument()
  })

  it('renders ○ DISCOVERY for discovery status', () => {
    render(<StatusBadge status="discovery" />)
    expect(screen.getByText('○ DISCOVERY')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```
Expected: FAIL with `Cannot find module '../StatusBadge'`.

- [ ] **Step 3: Implement StatusBadge**

Create `components/StatusBadge.tsx`:
```tsx
import type { ProjectStatus } from '@/lib/types'

const STATUS_CONFIG: Record<ProjectStatus, { symbol: string; label: string; color: string }> = {
  live: { symbol: '●', label: 'LIVE', color: '#3fb950' },
  'in-flight': { symbol: '◐', label: 'IN FLIGHT', color: '#d29922' },
  discovery: { symbol: '○', label: 'DISCOVERY', color: '#6e7681' },
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { symbol, label, color } = STATUS_CONFIG[status]
  return (
    <span className="font-mono text-[10px] tracking-wider" style={{ color }}>
      {symbol} {label}
    </span>
  )
}
```

- [ ] **Step 4: Run tests — verify they all pass**

```bash
npm test
```
Expected: 3 passing in `StatusBadge.test.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/StatusBadge.tsx components/__tests__/StatusBadge.test.tsx
git commit -m "feat: add StatusBadge component"
```

---

## Task 7: TagPill Component

**Files:**
- Create: `components/TagPill.tsx`, `components/__tests__/TagPill.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/__tests__/TagPill.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TagPill } from '../TagPill'

describe('TagPill', () => {
  it('renders the tag text', () => {
    render(<TagPill tag="open-source" />)
    expect(screen.getByText('open-source')).toBeInTheDocument()
  })

  it('renders any arbitrary tag text', () => {
    render(<TagPill tag="template" />)
    expect(screen.getByText('template')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```
Expected: FAIL with `Cannot find module '../TagPill'`.

- [ ] **Step 3: Implement TagPill**

Create `components/TagPill.tsx`:
```tsx
export function TagPill({ tag }: { tag: string }) {
  return (
    <span className="rounded-full bg-[#388bfd26] px-2 py-0.5 font-mono text-[10px] text-[#58a6ff]">
      {tag}
    </span>
  )
}
```

- [ ] **Step 4: Run tests — verify they all pass**

```bash
npm test
```
Expected: 2 passing in `TagPill.test.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/TagPill.tsx components/__tests__/TagPill.test.tsx
git commit -m "feat: add TagPill component"
```

---

## Task 8: MissionControlHeader Component

**Files:**
- Create: `components/MissionControlHeader.tsx`, `components/__tests__/MissionControlHeader.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `components/__tests__/MissionControlHeader.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MissionControlHeader } from '../MissionControlHeader'

describe('MissionControlHeader', () => {
  it('renders the MISSION CONTROL title', () => {
    render(<MissionControlHeader liveCount={2} />)
    expect(screen.getByText('MISSION CONTROL')).toBeInTheDocument()
  })

  it('renders the live count', () => {
    render(<MissionControlHeader liveCount={3} />)
    expect(screen.getByText(/3 live/)).toBeInTheDocument()
  })

  it('renders the status prompt', () => {
    render(<MissionControlHeader liveCount={0} />)
    expect(screen.getByText(/\$ status --all/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```
Expected: FAIL with `Cannot find module '../MissionControlHeader'`.

- [ ] **Step 3: Implement MissionControlHeader**

Create `components/MissionControlHeader.tsx`:
```tsx
export function MissionControlHeader({ liveCount }: { liveCount: number }) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-[#21262d] pb-4">
      <h1 className="font-mono text-lg font-bold tracking-[0.2em] text-[#58a6ff]">
        MISSION CONTROL
      </h1>
      <div className="font-mono text-xs text-[#8b949e]">
        <span>$ status --all</span>
        <span className="ml-4 text-[#3fb950]">● {liveCount} live</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — verify they all pass**

```bash
npm test
```
Expected: 3 passing in `MissionControlHeader.test.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/MissionControlHeader.tsx components/__tests__/MissionControlHeader.test.tsx
git commit -m "feat: add MissionControlHeader component"
```

---

## Task 9: ProjectTile Component

**Files:**
- Create: `components/ProjectTile.tsx`, `components/__tests__/ProjectTile.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `components/__tests__/ProjectTile.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProjectTile } from '../ProjectTile'
import type { ProjectData } from '@/lib/types'

const base: ProjectData = {
  owner: 'alice',
  repo: 'my-app',
  status: 'live',
  url: null,
  tags: [],
  featured: false,
  description: null,
  language: null,
  stars: null,
  pushedAt: null,
  githubUrl: 'https://github.com/alice/my-app',
}

describe('ProjectTile', () => {
  it('renders repo name', () => {
    render(<ProjectTile project={base} />)
    expect(screen.getByText('my-app')).toBeInTheDocument()
  })

  it('renders description when present', () => {
    render(<ProjectTile project={{ ...base, description: 'A great app' }} />)
    expect(screen.getByText('A great app')).toBeInTheDocument()
  })

  it('renders live link when url is set', () => {
    render(<ProjectTile project={{ ...base, url: 'https://myapp.com' }} />)
    const link = screen.getByRole('link', { name: /live/ })
    expect(link).toHaveAttribute('href', 'https://myapp.com')
  })

  it('renders github link when no url but githubUrl present', () => {
    render(<ProjectTile project={base} />)
    const link = screen.getByRole('link', { name: /github/ })
    expect(link).toHaveAttribute('href', 'https://github.com/alice/my-app')
  })

  it('renders no link when both url and githubUrl are null', () => {
    render(<ProjectTile project={{ ...base, githubUrl: null }} />)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('renders tag pills', () => {
    render(<ProjectTile project={{ ...base, tags: ['open-source', 'template'] }} />)
    expect(screen.getByText('open-source')).toBeInTheDocument()
    expect(screen.getByText('template')).toBeInTheDocument()
  })

  it('renders language badge when present', () => {
    render(<ProjectTile project={{ ...base, language: 'TypeScript' }} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders star count when present', () => {
    render(<ProjectTile project={{ ...base, stars: 42 }} />)
    expect(screen.getByText(/★ 42/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```
Expected: FAIL with `Cannot find module '../ProjectTile'`.

- [ ] **Step 3: Implement ProjectTile**

Create `components/ProjectTile.tsx`:
```tsx
import { StatusBadge } from './StatusBadge'
import { TagPill } from './TagPill'
import type { ProjectData } from '@/lib/types'

function formatPushedAt(pushedAt: string | null): string {
  if (!pushedAt) return ''
  const diffDays = Math.floor((Date.now() - new Date(pushedAt).getTime()) / 86_400_000)
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return '1d ago'
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

export function ProjectTile({ project }: { project: ProjectData }) {
  const displayUrl = project.url ?? project.githubUrl
  const linkLabel = project.url ? '→ live' : '→ github'

  return (
    <div className="flex h-full flex-col gap-2 rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
      <div className="flex items-center justify-between">
        <StatusBadge status={project.status} />
        {project.language && (
          <span className="font-mono text-[10px] text-[#8b949e]">{project.language}</span>
        )}
      </div>

      <h2 className="font-mono text-sm text-[#e6edf3]">{project.repo}</h2>

      {project.description && (
        <p className="line-clamp-2 text-xs text-[#8b949e]">{project.description}</p>
      )}

      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-2 font-mono text-[10px] text-[#8b949e]">
        <div className="flex gap-3">
          {project.stars !== null && <span>★ {project.stars}</span>}
          {project.pushedAt && <span>{formatPushedAt(project.pushedAt)}</span>}
        </div>
        {displayUrl && (
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#58a6ff] hover:underline"
          >
            {linkLabel}
          </a>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — verify they all pass**

```bash
npm test
```
Expected: 8 passing in `ProjectTile.test.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/ProjectTile.tsx components/__tests__/ProjectTile.test.tsx
git commit -m "feat: add ProjectTile component"
```

---

## Task 10: BentoGrid Component

**Files:**
- Create: `components/BentoGrid.tsx`

No isolated logic to unit test — the grid is a CSS layout wrapper. Visual correctness is verified in Task 11 (dev server smoke test).

- [ ] **Step 1: Create BentoGrid**

Create `components/BentoGrid.tsx`:
```tsx
import { ProjectTile } from './ProjectTile'
import type { ProjectData } from '@/lib/types'

export function BentoGrid({ projects }: { projects: ProjectData[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={`${project.owner}/${project.repo}`}
          className={project.featured ? 'sm:col-span-2' : ''}
        >
          <ProjectTile project={project} />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/BentoGrid.tsx
git commit -m "feat: add BentoGrid layout component"
```

---

## Task 11: Page Assembly

**Files:**
- Modify: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Update globals.css**

Replace the contents of `app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 2: Update root layout**

Replace `app/layout.tsx` with:
```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Engineering portfolio — live system status',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#010409]">{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Wire up the page**

Replace `app/page.tsx` with:
```tsx
import { loadProjectsConfig } from '@/lib/config'
import { fetchAllProjects } from '@/lib/github'
import { MissionControlHeader } from '@/components/MissionControlHeader'
import { BentoGrid } from '@/components/BentoGrid'

export default async function Home() {
  const config = loadProjectsConfig()
  const projects = await fetchAllProjects(config.repos)
  const liveCount = projects.filter((p) => p.status === 'live').length

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <MissionControlHeader liveCount={liveCount} />
        <BentoGrid projects={projects} />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/layout.tsx app/globals.css
git commit -m "feat: wire up page with data fetch and bento grid"
```

---

## Task 12: Seed Config and Env Files

**Files:**
- Create: `projects-config.json`, `.env.example`, `.env.local` (gitignored)

- [ ] **Step 1: Create projects-config.json**

Create `projects-config.json` at the repo root — replace the placeholders with your actual GitHub username and repo names:
```json
{
  "repos": [
    {
      "owner": "YOUR_GITHUB_USERNAME",
      "repo": "YOUR_FEATURED_REPO",
      "status": "live",
      "url": "https://your-live-url.vercel.app",
      "tags": ["open-source"],
      "featured": true
    },
    {
      "owner": "YOUR_GITHUB_USERNAME",
      "repo": "YOUR_WIP_REPO",
      "status": "in-flight",
      "tags": ["open-source"]
    },
    {
      "owner": "YOUR_GITHUB_USERNAME",
      "repo": "YOUR_IDEA_REPO",
      "status": "discovery"
    }
  ]
}
```

- [ ] **Step 2: Create .env.example**

Create `.env.example`:
```
# GitHub Personal Access Token (read-only, public repos only)
# Create at: https://github.com/settings/tokens/new
# Required scopes: none (public repo access is unauthenticated)
# Without this, GitHub API is limited to 60 requests/hour
GITHUB_TOKEN=your_token_here
```

- [ ] **Step 3: Create .env.local for local dev**

Create `.env.local` (this file is gitignored by create-next-app):
```
GITHUB_TOKEN=your_actual_token_here
```

- [ ] **Step 4: Verify .gitignore excludes .env.local**

```bash
grep ".env.local" .gitignore
```
Expected: `.env*.local` or `.env.local` appears. If not, add it:
```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 5: Run full test suite**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 6: Start dev server and verify the dashboard renders**

```bash
npm run dev
```
Open http://localhost:3000. Verify:
- Dark background renders
- MISSION CONTROL header with `$ status --all` and live count appears
- Project tiles render with correct status badges, language, tags
- Links open to the correct URLs
- Layout is responsive (resize the browser window)

Kill the server with Ctrl+C.

- [ ] **Step 7: Commit**

```bash
git add projects-config.json .env.example .gitignore
git commit -m "feat: add seed config and env var documentation"
```

---

## Task 13: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

Create a new repo at https://github.com/new named `showcase` (or any name). Then:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/showcase.git
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**

1. Go to https://vercel.com/new
2. Import the `showcase` repo
3. Framework preset: **Next.js** (auto-detected)
4. Build command: `npm run build` (default)
5. Output directory: `.next` (default)

- [ ] **Step 3: Add environment variable**

In the Vercel project settings → Environment Variables:
- Name: `GITHUB_TOKEN`
- Value: your GitHub personal access token
- Environment: Production, Preview, Development

- [ ] **Step 4: Deploy**

Click **Deploy**. Vercel will build and deploy. Visit the generated `.vercel.app` URL and verify the dashboard matches the local version.

- [ ] **Step 5: Update projects-config.json with the Vercel URL (if applicable)**

If the portfolio itself is the "live" project, update `projects-config.json` with the `.vercel.app` URL for any repos that reference it, commit, and push:
```bash
git add projects-config.json
git commit -m "chore: update live URL after Vercel deploy"
git push
```
