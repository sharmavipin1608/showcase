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
