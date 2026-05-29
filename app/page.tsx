import { loadProjectsConfig } from '@/lib/config'
import { fetchAllProjects, fetchContributionStreak, fetchUserActivity } from '@/lib/github'
import { MissionControlHeader } from '@/components/MissionControlHeader'
import { BentoGrid } from '@/components/BentoGrid'
import { AboutCard } from '@/components/AboutCard'
import { ActivityWidget } from '@/components/ActivityWidget'
import { TelemetryWidget } from '@/components/TelemetryWidget'

export default async function Home() {
  const config = loadProjectsConfig()
  const owner = config.repos[0].owner

  const [projects, streak, activity] = await Promise.all([
    fetchAllProjects(config.repos),
    fetchContributionStreak(owner),
    fetchUserActivity(owner),
  ])

  const liveCount = projects.filter((p) => p.status === 'live').length
  const inFlightCount = projects.filter((p) => p.status === 'in-flight').length
  const discoveryCount = projects.filter((p) => p.status === 'discovery').length

  // Telemetry — tech frequency relative to most-used tech
  const techCount: Record<string, number> = {}
  for (const project of projects) {
    for (const tech of project.techStack) {
      techCount[tech] = (techCount[tech] ?? 0) + 1
    }
  }
  const maxCount = Math.max(...Object.values(techCount), 1)
  const techFrequency = Object.entries(techCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count, pct: Math.round((count / maxCount) * 100) }))

  const totalStars = projects.reduce((sum, p) => sum + (p.stars ?? 0), 0)
  const totalCommits = projects.reduce((sum, p) => sum + (p.commitCount ?? 0), 0)

  return (
    <main className="flex flex-col">

      {/* Full-width header — spans all 3 columns */}
      <div className="px-6 pt-8 pb-3 sm:px-10 2xl:px-16">
        <MissionControlHeader liveCount={liveCount} inFlightCount={inFlightCount} discoveryCount={discoveryCount} />
      </div>

      {/* 3-col body — sidebars start below header */}
      <div className="2xl:grid 2xl:grid-cols-[1fr_minmax(0,72rem)_1fr]">

        {/* Left sidebar — About + Telemetry stacked */}
        <aside className="hidden 2xl:flex flex-col px-4 pt-4 min-w-0">
          <div className="sticky top-4 flex flex-col gap-4 w-full">
            <AboutCard />
            <TelemetryWidget
              techFrequency={techFrequency}
              projectCount={projects.length}
              totalStars={totalStars}
              totalCommits={totalCommits}
              streak={streak}
            />
          </div>
        </aside>

        {/* Center — project grid only */}
        <div className="mx-auto w-full max-w-6xl px-6 py-4 sm:px-10 2xl:mx-0 2xl:max-w-none 2xl:px-0">
          <BentoGrid projects={projects} />
        </div>

        {/* Right sidebar — Activity */}
        <aside className="hidden 2xl:flex flex-col px-4 pt-4 min-w-0">
          <div className="sticky top-4 w-full">
            <ActivityWidget events={activity} />
          </div>
        </aside>
      </div>

      {/* Footer — closes the page cleanly */}
      <div className="mt-8 border-t border-[#21262d] px-6 py-4 sm:px-10 2xl:px-16">
        <p className="text-[10px] text-[#484f58]">
          vipin sharma · updated live · built with next.js + claude
        </p>
      </div>

    </main>
  )
}
