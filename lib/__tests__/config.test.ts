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
