import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProjectTile } from '../ProjectTile'
import type { ProjectData } from '@/lib/types'

const base: ProjectData = {
  owner: 'alice',
  repo: 'my-app',
  status: 'live',
  url: null,
  tags: [],
  featured: false,
  description: null,
  language: null,
  stars: null,
  pushedAt: null,
  githubUrl: 'https://github.com/alice/my-app',
}

describe('ProjectTile', () => {
  it('renders repo name', () => {
    render(<ProjectTile project={base} />)
    expect(screen.getByText('my-app')).toBeInTheDocument()
  })

  it('renders description when present', () => {
    render(<ProjectTile project={{ ...base, description: 'A great app' }} />)
    expect(screen.getByText('A great app')).toBeInTheDocument()
  })

  it('renders live link when url is set', () => {
    render(<ProjectTile project={{ ...base, url: 'https://myapp.com' }} />)
    const link = screen.getByRole('link', { name: /live/ })
    expect(link).toHaveAttribute('href', 'https://myapp.com')
  })

  it('renders github link when no url but githubUrl present', () => {
    render(<ProjectTile project={base} />)
    const link = screen.getByRole('link', { name: /github/ })
    expect(link).toHaveAttribute('href', 'https://github.com/alice/my-app')
  })

  it('renders no link when both url and githubUrl are null', () => {
    render(<ProjectTile project={{ ...base, githubUrl: null }} />)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('renders tag pills', () => {
    render(<ProjectTile project={{ ...base, tags: ['open-source', 'template'] }} />)
    expect(screen.getByText('open-source')).toBeInTheDocument()
    expect(screen.getByText('template')).toBeInTheDocument()
  })

  it('renders language badge when present', () => {
    render(<ProjectTile project={{ ...base, language: 'TypeScript' }} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders star count when present', () => {
    render(<ProjectTile project={{ ...base, stars: 42 }} />)
    expect(screen.getByText(/★ 42/)).toBeInTheDocument()
  })
})
