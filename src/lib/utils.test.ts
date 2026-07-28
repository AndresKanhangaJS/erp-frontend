import { describe, expect, it } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  it('junta classes simples', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('ignora valores falsy', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })

  it('resolve conflitos do Tailwind mantendo a ultima classe', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })
})
