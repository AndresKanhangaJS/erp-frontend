import { afterEach, describe, expect, it, vi } from 'vitest'

import { resolveIsDark, useUiStore } from './uiStore'

describe('resolveIsDark', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('devolve true directamente para "dark"', () => {
    expect(resolveIsDark('dark')).toBe(true)
  })

  it('devolve false directamente para "light"', () => {
    expect(resolveIsDark('light')).toBe(false)
  })

  it('para "system" segue o resultado do matchMedia', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn() }),
    )
    expect(resolveIsDark('system')).toBe(true)
  })
})

describe('useUiStore', () => {
  it('toggleSidebar inverte sidebarOpen', () => {
    const initial = useUiStore.getState().sidebarOpen
    useUiStore.getState().toggleSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(!initial)
    useUiStore.getState().toggleSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(initial)
  })

  it('setSidebarOpen define o valor exacto', () => {
    useUiStore.getState().setSidebarOpen(false)
    expect(useUiStore.getState().sidebarOpen).toBe(false)
    useUiStore.getState().setSidebarOpen(true)
    expect(useUiStore.getState().sidebarOpen).toBe(true)
  })
})
