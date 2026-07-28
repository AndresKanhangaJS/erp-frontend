import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useKeyboardShortcut } from './useKeyboardShortcut'

function dispatchKeydown(init: KeyboardEventInit) {
  window.dispatchEvent(new KeyboardEvent('keydown', init))
}

describe('useKeyboardShortcut', () => {
  it('chama o callback quando a combinacao bate certo', () => {
    const callback = vi.fn()
    renderHook(() => useKeyboardShortcut('mod+k', callback))

    dispatchKeydown({ key: 'k', ctrlKey: true })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('nao chama o callback quando falta o modificador', () => {
    const callback = vi.fn()
    renderHook(() => useKeyboardShortcut('mod+k', callback))

    dispatchKeydown({ key: 'k' })

    expect(callback).not.toHaveBeenCalled()
  })

  it('nao chama o callback quando enabled e false', () => {
    const callback = vi.fn()
    renderHook(() => useKeyboardShortcut('escape', callback, { enabled: false }))

    dispatchKeydown({ key: 'Escape' })

    expect(callback).not.toHaveBeenCalled()
  })

  it('remove o listener quando desmonta', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useKeyboardShortcut('escape', callback))

    unmount()
    dispatchKeydown({ key: 'Escape' })

    expect(callback).not.toHaveBeenCalled()
  })
})
