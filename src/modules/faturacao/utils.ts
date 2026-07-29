import type { linhaFaturaSchema } from './schemas/emitirFaturaSchema'
import type { z } from 'zod'

type LinhaFaturaForm = z.infer<typeof linhaFaturaSchema>

export interface TotaisCalculados {
  subtotal: number
  totalIva: number
  total: number
}

/** taxaIva é sempre fracção (0.14 = 14%), nunca percentagem. */
export function calcularTotais(linhas: LinhaFaturaForm[]): TotaisCalculados {
  const subtotal = linhas.reduce(
    (acc, linha) => acc + linha.quantidade * (linha.precoUnitario ?? 0),
    0,
  )
  const totalIva = linhas.reduce(
    (acc, linha) => acc + linha.quantidade * (linha.precoUnitario ?? 0) * linha.taxaIva,
    0,
  )
  return { subtotal, totalIva, total: subtotal + totalIva }
}
