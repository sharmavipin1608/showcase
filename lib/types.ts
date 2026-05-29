export type ProjectStatus = 'live' | 'in-flight' | 'discovery'

export interface RepoConfig {
  owner: string
  repo: string
  status: ProjectStatus
  url?: string
  tags?: string[]
  featured?: boolean
  techStack?: string[]
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
  techStack: string[]
  description: string | null
  language: string | null
  stars: number | null
  pushedAt: string | null
  githubUrl: string | null
}
