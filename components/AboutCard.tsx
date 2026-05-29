function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden>
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden>
      <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2L9.5 1.5z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden>
      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
    </svg>
  )
}

const LINKS = [
  { label: 'github',   href: 'https://github.com/sharmavipin1608',             Icon: GitHubIcon,   external: true  },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/sharmavipin1986/',    Icon: LinkedInIcon, external: true  },
  { label: 'resume',   href: '/resume.pdf',                                     Icon: FileIcon,     external: true  },
  { label: 'email',    href: 'mailto:sharma.vipin1608@gmail.com',               Icon: MailIcon,     external: false },
]

const FOCUS = ['AI Agents', 'Full Stack', 'LLMs', 'Dev Tools']

export function AboutCard() {
  return (
    <div className="rounded-xl border border-[#30363d] bg-gradient-to-b from-[#161b22] to-[#0d1117] p-4 flex flex-col gap-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

      {/* Avatar + identity — side by side */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://github.com/sharmavipin1608.png"
            alt="Vipin Sharma"
            width={52}
            height={52}
            className="rounded-full border-2 border-[#30363d]"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#3fb950] border-2 border-[#0d1117]" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-wide text-[#e6edf3]">Vipin Sharma</div>
          <div className="text-xs text-[#58a6ff]">Staff Engineer</div>
          <div className="text-[11px] text-[#6e7681]">AI &amp; Full Stack</div>
        </div>
      </div>

      <div className="border-t border-[#21262d]" />

      {/* Bio */}
      <p className="text-xs leading-relaxed text-[#6e7681]">
        Building AI-native developer tools and full-stack products. Focused on agentic systems, developer experience, and shipping fast.
      </p>

      {/* Focus pills */}
      <div className="flex flex-wrap gap-1.5">
        {FOCUS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#30363d] px-2 py-0.5 text-[10px] text-[#8b949e]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="border-t border-[#21262d]" />

      {/* Links */}
      <div className="flex flex-col gap-2.5">
        {LINKS.map(({ label, href, Icon, external }) => (
          <a
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="group flex items-center justify-between text-xs text-[#8b949e] transition-colors hover:text-[#58a6ff]"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-[#484f58] transition-colors group-hover:text-[#58a6ff]">
                <Icon />
              </span>
              {label}
            </span>
            {external && (
              <span className="text-[10px] text-[#484f58] transition-colors group-hover:text-[#58a6ff]">↗</span>
            )}
          </a>
        ))}
      </div>

      <div className="border-t border-[#21262d]" />

      {/* Status */}
      <div className="flex items-center gap-2 text-[11px] text-[#484f58]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3fb950] opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3fb950]" />
        </span>
        available for opportunities
      </div>

    </div>
  )
}
