import type { ProjectStatus } from '@/lib/types'

const STATUS_CONFIG: Record<ProjectStatus, { symbol: string; label: string; color: string }> = {
  live: { symbol: '●', label: 'LIVE', color: '#3fb950' },
  'in-flight': { symbol: '◐', label: 'IN FLIGHT', color: '#d29922' },
  discovery: { symbol: '○', label: 'DISCOVERY', color: '#6e7681' },
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { symbol, label, color } = STATUS_CONFIG[status]
  return (
    <span className="font-mono text-[10px] tracking-wider" style={{ color }}>
      {symbol} {label}
    </span>
  )
}
