export function MissionControlHeader({ liveCount }: { liveCount: number }) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-[#21262d] pb-4">
      <h1 className="font-mono text-lg font-bold tracking-[0.2em] text-[#58a6ff]">
        MISSION CONTROL
      </h1>
      <div className="font-mono text-xs text-[#8b949e]">
        <span>$ status --all</span>
        <span className="ml-4 text-[#3fb950]">● {liveCount} live</span>
      </div>
    </div>
  )
}
