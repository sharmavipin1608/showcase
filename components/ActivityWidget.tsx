import type { ActivityEvent } from '@/lib/types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const BRANCH_COLORS: Record<string, string> = {
  main: '#3fb950',
  master: '#3fb950',
  develop: '#58a6ff',
  dev: '#58a6ff',
}

function branchColor(branch: string): string {
  return BRANCH_COLORS[branch.toLowerCase()] ?? '#bc8cff'
}

export function ActivityWidget({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#30363d] bg-gradient-to-b from-[#161b22] to-[#0d1117] p-4 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.15em] text-[#58a6ff]">ACTIVITY</span>
        <span className="text-[10px] text-[#484f58]">$ git log --all</span>
      </div>

      <div className="border-t border-[#21262d]" />

      {events.length === 0 ? (
        <p className="text-[10px] text-[#484f58]">no recent push events</p>
      ) : (
        <div className="relative">
          <div className="overflow-y-auto max-h-[43.5rem] flex flex-col divide-y divide-[#21262d] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-[#30363d]">
            {events.map((event) => (
              <div key={event.id} className="flex gap-2.5 py-2.5 first:pt-0 last:pb-0">
                <span
                  className="mt-[5px] shrink-0 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: branchColor(event.branch) }}
                />
                <div className="min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#e6edf3] truncate">{event.repo}</span>
                    <span className="shrink-0 text-[10px] text-[#484f58]">{timeAgo(event.createdAt)}</span>
                  </div>
                  <span className="text-[11px] leading-relaxed text-[#6e7681] line-clamp-2">{event.message}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0d1117] to-transparent" />
        </div>
      )}
    </div>
  )
}
