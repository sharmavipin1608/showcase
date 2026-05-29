import { StatusBadge } from './StatusBadge'
import { TagPill } from './TagPill'
import { TechPill } from './TechPill'
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

function TileInner({ project }: { project: ProjectData }) {
  const displayUrl = project.url ?? project.githubUrl

  return (
    <>
      {/* Top row: status + tech pills */}
      <div className="flex items-start justify-between gap-2">
        <StatusBadge status={project.status} />
        {(() => {
          const techs = project.techStack.length > 0
            ? project.techStack.slice(0, 3)
            : project.language ? [project.language] : []
          return techs.length > 0 ? (
            <div className="flex flex-wrap justify-end gap-1">
              {techs.map((t) => <TechPill key={t} tech={t} />)}
            </div>
          ) : null
        })()}
      </div>

      {/* Repo name */}
      <h2 className="text-sm font-semibold tracking-wide text-[#e6edf3] transition-colors group-hover:text-[#58a6ff]">
        {project.repo}
      </h2>

      {/* Description */}
      {project.description && (
        <p
          className="text-xs leading-relaxed text-[#8b949e]"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {project.description}
        </p>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Bottom row: stars + timestamp + link hint */}
      <div className="mt-auto flex items-center justify-between border-t border-[#21262d] pt-3 text-[10px] text-[#8b949e]">
        <div className="flex gap-3">
          {project.stars !== null && <span>★ {project.stars}</span>}
          {project.pushedAt && <span>{formatPushedAt(project.pushedAt)}</span>}
        </div>
        {displayUrl && (
          <span className="text-[#58a6ff]">
            {project.url ? '→ live' : '→ github'}
          </span>
        )}
      </div>
    </>
  )
}

const cardClass =
  'group flex h-full flex-col gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-5 transition-all duration-200 hover:border-[#58a6ff] hover:bg-[#161b22] hover:shadow-[0_0_0_1px_#58a6ff22]'

export function ProjectTile({ project }: { project: ProjectData }) {
  const displayUrl = project.url ?? project.githubUrl

  if (displayUrl) {
    return (
      <a
        href={displayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
        style={{ textDecoration: 'none' }}
      >
        <TileInner project={project} />
      </a>
    )
  }

  return (
    <div className={cardClass}>
      <TileInner project={project} />
    </div>
  )
}
