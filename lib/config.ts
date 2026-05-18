import { readFileSync } from 'fs'
import path from 'path'
import type { ProjectsConfig } from './types'

const VALID_STATUSES = ['live', 'in-flight', 'discovery'] as const

export function loadProjectsConfig(): ProjectsConfig {
  const configPath = path.join(process.cwd(), 'projects-config.json')
  const raw = readFileSync(configPath, 'utf-8')
  const parsed = JSON.parse(raw) as unknown as { repos?: unknown[] }

  if (!parsed.repos || !Array.isArray(parsed.repos)) {
    throw new Error('projects-config.json must have a "repos" array')
  }

  for (const entry of parsed.repos) {
    if (typeof (entry as any).owner !== 'string' || (entry as any).owner.trim() === '') {
      throw new Error(`Invalid repo config: missing "owner" in ${JSON.stringify(entry)}`)
    }
    if (typeof (entry as any).repo !== 'string' || (entry as any).repo.trim() === '') {
      throw new Error(`Invalid repo config: missing "repo" in ${JSON.stringify(entry)}`)
    }
    if (!VALID_STATUSES.includes((entry as any).status)) {
      throw new Error(
        `Invalid status "${(entry as any).status}" for ${(entry as any).owner}/${(entry as any).repo}. Must be one of: ${VALID_STATUSES.join(', ')}`
      )
    }
  }

  return parsed as unknown as ProjectsConfig
}
