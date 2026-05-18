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
