import { loadProjectsConfig } from '@/lib/config'
import { fetchAllProjects } from '@/lib/github'
import { MissionControlHeader } from '@/components/MissionControlHeader'
import { BentoGrid } from '@/components/BentoGrid'

export default async function Home() {
  const config = loadProjectsConfig()
  const projects = await fetchAllProjects(config.repos)
  const liveCount = projects.filter((p) => p.status === 'live').length

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <MissionControlHeader liveCount={liveCount} />
        <BentoGrid projects={projects} />
      </div>
    </main>
  )
}
