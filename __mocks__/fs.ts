import { vi } from 'vitest'
import { readFileSync as realReadFileSync } from 'node:fs'

const fs = {
  ...require('fs'),
  readFileSync: vi.fn(),
}

module.exports = fs
