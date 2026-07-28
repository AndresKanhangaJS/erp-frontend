import { useEffect, useState } from 'react'

/**
 * Atrasa a propagação de um valor — usado sobretudo em pesquisa async
 * (ClienteCombobox, ArtigoCombobox) para não disparar um pedido por
 * cada tecla premida.
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timeout)
  }, [value, delayMs])

  return debounced
}
