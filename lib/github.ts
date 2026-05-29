import type { RepoConfig, GitHubRepoData, ProjectData, ActivityEvent } from './types'

if (!process.env.GITHUB_TOKEN) {
  console.warn('[github] GITHUB_TOKEN not set — using unauthenticated requests (60 req/hr limit)')
}

function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN
  return {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function fetchCommitCount(owner: string, repo: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
      { headers: getHeaders(), next: { revalidate: 3600 } }
    )
    if (!res.ok) return null

    const link = res.headers.get('link')
    if (!link) {
      // Fewer than 2 commits — count from the response body
      const data = await res.json()
      return Array.isArray(data) ? data.length : null
    }

    const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/)
    return match ? parseInt(match[1], 10) : null
  } catch {
    return null
  }
}

export async function fetchContributionStreak(username: string): Promise<number> {
  const token = process.env.GITHUB_TOKEN
  if (!token) return 0

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) return 0

    const json = await res.json()
    const weeks: { contributionDays: { date: string; contributionCount: number }[] }[] =
      json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []

    const days = weeks
      .flatMap((w) => w.contributionDays)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const today = new Date().toISOString().split('T')[0]
    let i = 0

    // Skip today if no contributions yet — might be early in the day
    if (days[0]?.date === today && days[0]?.contributionCount === 0) i = 1

    let streak = 0
    for (; i < days.length; i++) {
      if (days[i].contributionCount > 0) streak++
      else break
    }

    return streak
  } catch {
    return 0
  }
}

async function fetchCommitMessage(repoFullName: string, sha: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits/${sha}`,
      { headers: getHeaders(), next: { revalidate: 3600 } }
    )
    if (!res.ok) return sha.slice(0, 7)
    const data = await res.json()
    return String(data?.commit?.message ?? sha.slice(0, 7)).split('\n')[0]
  } catch {
    return sha.slice(0, 7)
  }
}

export async function fetchUserActivity(username: string): Promise<ActivityEvent[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/events?per_page=30`,
      { headers: getHeaders(), next: { revalidate: 900 } }
    )
    if (!res.ok) return []

    const events = await res.json()

    const pushEvents = (events as any[])
      .filter((e) => e.type === 'PushEvent' && e.payload?.ref && e.payload?.head)
      .slice(0, 15)

    return Promise.all(
      pushEvents.map(async (e) => {
        const repoFullName = String(e.repo?.name ?? '')
        const head = String(e.payload.head ?? '')
        // GitHub's events API no longer includes commits[] in the payload —
        // fetch the head commit separately to get the message.
        const message = await fetchCommitMessage(repoFullName, head)
        return {
          id: String(e.id),
          repo: repoFullName.split('/')[1] ?? repoFullName,
          message,
          branch: String(e.payload.ref ?? '').replace('refs/heads/', ''),
          createdAt: String(e.created_at ?? ''),
        }
      })
    )
  } catch {
    return []
  }
}

export async function fetchRepoData(owner: string, repo: string): Promise<GitHubRepoData | null> {
  try {
    const [repoRes, commitCount] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: getHeaders(),
        next: { revalidate: 3600 },
      }),
      fetchCommitCount(owner, repo),
    ])

    if (repoRes.status === 404) {
      console.warn(`[github] Repo ${owner}/${repo} not found or private — skipping`)
      return null
    }

    if (!repoRes.ok) {
      console.warn(`[github] Failed to fetch ${owner}/${repo}: ${repoRes.status} ${repoRes.statusText}`)
      return null
    }

    const data = await repoRes.json()
    return {
      description: data.description ?? null,
      language: data.language ?? null,
      stargazers_count: data.stargazers_count ?? 0,
      pushed_at: data.pushed_at ?? '',
      homepage: data.homepage ?? null,
      html_url: data.html_url ?? '',
      commit_count: commitCount,
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
    techStack: config.techStack ?? [],
    description: github?.description ?? null,
    language: github?.language ?? null,
    stars: github?.stargazers_count ?? null,
    pushedAt: github?.pushed_at ?? null,
    githubUrl: github?.html_url ?? null,
    commitCount: github?.commit_count ?? null,
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
