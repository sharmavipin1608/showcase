interface TechFreq {
  name: string
  pct: number
  count: number
}

interface TelemetryProps {
  techFrequency: TechFreq[]
  projectCount: number
  totalStars: number
  totalCommits: number
  streak: number
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function TelemetryWidget({ techFrequency, projectCount, totalStars, totalCommits, streak }: TelemetryProps) {
  const stats = [
    { label: 'projects', value: fmt(projectCount) },
    { label: 'stars',    value: fmt(totalStars)    },
    { label: 'commits',  value: fmt(totalCommits)  },
    { label: 'streak',   value: streak > 0 ? `${streak}d` : '—' },
  ]

  return (
    <div className="rounded-xl border border-[#30363d] bg-gradient-to-b from-[#161b22] to-[#0d1117] p-4 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.15em] text-[#58a6ff]">TELEMETRY</span>
        <span className="text-[10px] text-[#484f58]">$ stack --analyze</span>
      </div>

      <div className="border-t border-[#21262d]" />

      {/* Tech frequency bars */}
      <div className="flex flex-col gap-2.5">
        {techFrequency.map(({ name, pct, count }) => (
          <div key={name} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#6e7681]">{name}</span>
              <span className="text-[#484f58]">{count}</span>
            </div>
            <div className="h-1 rounded-full bg-[#21262d]">
              <div
                className="h-1 rounded-full bg-[#58a6ff] opacity-70"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#21262d]" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-[#21262d] bg-[#0d1117] p-2 text-center">
            <div className="text-sm font-semibold text-[#e6edf3]">{value}</div>
            <div className="text-[10px] text-[#484f58]">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
