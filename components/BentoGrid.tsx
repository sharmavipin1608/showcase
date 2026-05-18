import { ProjectTile } from './ProjectTile'
import type { ProjectData } from '@/lib/types'

export function BentoGrid({ projects }: { projects: ProjectData[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={`${project.owner}/${project.repo}`}
          className={project.featured ? 'sm:col-span-2 lg:col-span-2' : ''}
        >
          <ProjectTile project={project} />
        </div>
      ))}
    </div>
  )
}
