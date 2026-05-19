import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MissionControlHeader } from '../MissionControlHeader'

describe('MissionControlHeader', () => {
  it('renders the MISSION CONTROL title', () => {
    render(<MissionControlHeader liveCount={2} inFlightCount={1} discoveryCount={0} />)
    expect(screen.getByText('MISSION CONTROL')).toBeInTheDocument()
  })

  it('renders the status prompt', () => {
    render(<MissionControlHeader liveCount={0} inFlightCount={0} discoveryCount={0} />)
    expect(screen.getByText(/\$ status --all/)).toBeInTheDocument()
  })

  it('renders all three status counts', () => {
    render(<MissionControlHeader liveCount={3} inFlightCount={2} discoveryCount={1} />)
    expect(screen.getByText(/3 live/)).toBeInTheDocument()
    expect(screen.getByText(/2 in-flight/)).toBeInTheDocument()
    expect(screen.getByText(/1 discovery/)).toBeInTheDocument()
  })
})
