export function MissionControlHeader({
  liveCount,
  inFlightCount,
  discoveryCount,
}: {
  liveCount: number
  inFlightCount: number
  discoveryCount: number
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#21262d] pb-5">
      <div>
        <h1 className="text-xl font-bold tracking-[0.25em] text-[#58a6ff]">
          MISSION CONTROL
        </h1>
        <p className="mt-1 text-[11px] text-[#484f58]">engineering portfolio · live system status</p>
      </div>
      <div className="text-right text-xs text-[#8b949e]">
        <div>$ status --all</div>
        <div className="mt-1 flex items-center justify-end gap-3">
          <span className="text-[#3fb950]">● {liveCount} live</span>
          <span className="text-[#d29922]">◐ {inFlightCount} in-flight</span>
          <span className="text-[#6e7681]">○ {discoveryCount} discovery</span>
        </div>
      </div>
    </div>
  )
}
