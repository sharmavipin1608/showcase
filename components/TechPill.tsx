const TECH_COLORS: Record<string, { bg: string; fg: string }> = {
  typescript:    { bg: '#1d4ed820', fg: '#93c5fd' },
  javascript:    { bg: '#78350f20', fg: '#fcd34d' },
  python:        { bg: '#14532d20', fg: '#86efac' },
  react:         { bg: '#0e749020', fg: '#67e8f9' },
  'next.js':     { bg: '#37415120', fg: '#d1d5db' },
  nextjs:        { bg: '#37415120', fg: '#d1d5db' },
  tailwindcss:   { bg: '#0c4a6e20', fg: '#38bdf8' },
  tailwind:      { bg: '#0c4a6e20', fg: '#38bdf8' },
  'node.js':     { bg: '#14532d20', fg: '#4ade80' },
  nodejs:        { bg: '#14532d20', fg: '#4ade80' },
  java:          { bg: '#4c1d9520', fg: '#c4b5fd' },
  'spring boot': { bg: '#14532d20', fg: '#86efac' },
  springboot:    { bg: '#14532d20', fg: '#86efac' },
  rust:          { bg: '#9a341220', fg: '#fb923c' },
  go:            { bg: '#0e749020', fg: '#22d3ee' },
  docker:        { bg: '#1e3a5f20', fg: '#60a5fa' },
  'claude api':  { bg: '#44403c20', fg: '#d6d3d1' },
  'claude sdk':  { bg: '#44403c20', fg: '#d6d3d1' },
  'claude code': { bg: '#44403c20', fg: '#d6d3d1' },
  'spring ai':   { bg: '#14532d20', fg: '#86efac' },
  'shadcn/ui':   { bg: '#37415120', fg: '#e5e7eb' },
  fastapi:       { bg: '#14532d20', fg: '#4ade80' },
  shell:         { bg: '#1c1917 20', fg: '#a8a29e' },
  vercel:        { bg: '#37415120', fg: '#e5e7eb' },
  postgresql:    { bg: '#1e3a5f20', fg: '#60a5fa' },
  postgres:      { bg: '#1e3a5f20', fg: '#60a5fa' },
  supabase:      { bg: '#14532d20', fg: '#34d399' },
  redis:         { bg: '#7f1d1d20', fg: '#fca5a5' },
  aws:           { bg: '#78350f20', fg: '#fb923c' },
}

function hashColor(tech: string): { bg: string; fg: string } {
  let h = 0
  for (let i = 0; i < tech.length; i++) h = (h * 31 + tech.charCodeAt(i)) >>> 0
  const hue = h % 360
  return { bg: `hsl(${hue} 60% 30% / 0.15)`, fg: `hsl(${hue} 80% 75%)` }
}

export function TechPill({ tech }: { tech: string }) {
  const key = tech.toLowerCase()
  const { bg, fg } = TECH_COLORS[key] ?? hashColor(key)
  return (
    <span
      className="rounded-full px-2 py-0.5 font-mono text-[10px]"
      style={{ backgroundColor: bg, color: fg }}
    >
      {tech}
    </span>
  )
}
