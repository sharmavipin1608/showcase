import { loadProjectsConfig } from '@/lib/config'
import { fetchAllProjects } from '@/lib/github'
import { MissionControlHeader } from '@/components/MissionControlHeader'
import { BentoGrid } from '@/components/BentoGrid'

export default async function Home() {
  const config = loadProjectsConfig()
  const projects = await fetchAllProjects(config.repos)
  const liveCount = projects.filter((p) => p.status === 'live').length
  const inFlightCount = projects.filter((p) => p.status === 'in-flight').length
  const discoveryCount = projects.filter((p) => p.status === 'discovery').length

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MissionControlHeader liveCount={liveCount} inFlightCount={inFlightCount} discoveryCount={discoveryCount} />
        <BentoGrid projects={projects} />
      </div>
    </main>
  )
}
