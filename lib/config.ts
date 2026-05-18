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
