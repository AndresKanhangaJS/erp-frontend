import { useEffect, useRef } from 'react'

interface UseKeyboardShortcutOptions {
  enabled?: boolean
}

/**
 * Atalho de teclado global. Combo em texto: "mod+k", "shift+n", "escape".
 * "mod" cobre Ctrl (Windows/Linux) e Cmd (Mac) na mesma combinação.
 */
export function useKeyboardShortcut(
  combo: string,
  callback: (event: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {},
): void {
  const { enabled = true } = options
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    const parts = combo.toLowerCase().split('+')
    const key = parts.at(-1)
    if (!key) return

    const needsMod = parts.includes('mod')
    const needsShift = parts.includes('shift')
    const needsAlt = parts.includes('alt')

    function handleKeyDown(event: KeyboardEvent) {
      if (needsMod !== (event.metaKey || event.ctrlKey)) return
      if (needsShift !== event.shiftKey) return
      if (needsAlt !== event.altKey) return
      if (event.key.toLowerCase() !== key) return

      event.preventDefault()
      callbackRef.current(event)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [combo, enabled])
}
