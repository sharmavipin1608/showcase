import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusBadge } from '../StatusBadge'

describe('StatusBadge', () => {
  it('renders ● LIVE for live status', () => {
    render(<StatusBadge status="live" />)
    expect(screen.getByText('● LIVE')).toBeInTheDocument()
  })

  it('renders ◐ IN FLIGHT for in-flight status', () => {
    render(<StatusBadge status="in-flight" />)
    expect(screen.getByText('◐ IN FLIGHT')).toBeInTheDocument()
  })

  it('renders ○ DISCOVERY for discovery status', () => {
    render(<StatusBadge status="discovery" />)
    expect(screen.getByText('○ DISCOVERY')).toBeInTheDocument()
  })
})
