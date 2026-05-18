export function MissionControlHeader({ liveCount }: { liveCount: number }) {
  return (
    <div className="mb-8 flex items-center justify-between border-b border-[#21262d] pb-5">
      <div>
        <h1 className="text-xl font-bold tracking-[0.25em] text-[#58a6ff]">
          MISSION CONTROL
        </h1>
        <p className="mt-1 text-[11px] text-[#484f58]">engineering portfolio · live system status</p>
      </div>
      <div className="text-right text-xs text-[#8b949e]">
        <div>$ status --all</div>
        <div className="mt-1 text-[#3fb950]">● {liveCount} live</div>
      </div>
    </div>
  )
}
