export function TagPill({ tag }: { tag: string }) {
  return (
    <span className="rounded-full bg-[#388bfd26] px-2 py-0.5 font-mono text-[10px] text-[#58a6ff]">
      {tag}
    </span>
  )
}
