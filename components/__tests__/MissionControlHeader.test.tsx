import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MissionControlHeader } from '../MissionControlHeader'

describe('MissionControlHeader', () => {
  it('renders the MISSION CONTROL title', () => {
    render(<MissionControlHeader liveCount={2} />)
    expect(screen.getByText('MISSION CONTROL')).toBeInTheDocument()
  })

  it('renders the live count', () => {
    render(<MissionControlHeader liveCount={3} />)
    expect(screen.getByText(/3 live/)).toBeInTheDocument()
  })

  it('renders the status prompt', () => {
    render(<MissionControlHeader liveCount={0} />)
    expect(screen.getByText(/\$ status --all/)).toBeInTheDocument()
  })
})
