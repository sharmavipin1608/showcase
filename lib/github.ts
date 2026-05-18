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
      // @ts-expect-error next revalidate
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
