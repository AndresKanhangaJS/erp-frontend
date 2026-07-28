import { describe, expect, it } from 'vitest'

import { formatNIF } from './formatNIF'

describe('formatNIF', () => {
  it('remove espacos nas pontas', () => {
    expect(formatNIF('  004598762LA042  ')).toBe('004598762LA042')
  })

  it('converte para maiusculas', () => {
    expect(formatNIF('004598762la042')).toBe('004598762LA042')
  })
})
