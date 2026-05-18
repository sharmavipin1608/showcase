import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TagPill } from '../TagPill'

describe('TagPill', () => {
  it('renders the tag text', () => {
    render(<TagPill tag="open-source" />)
    expect(screen.getByText('open-source')).toBeInTheDocument()
  })

  it('renders any arbitrary tag text', () => {
    render(<TagPill tag="template" />)
    expect(screen.getByText('template')).toBeInTheDocument()
  })
})
