import type { LinhaDocumento } from './types'

export interface TotaisCalculados {
  subtotal: number
  totalIva: number
  total: number
}

export function calcularTotais(linhas: LinhaDocumento[]): TotaisCalculados {
  const subtotal = linhas.reduce((acc, linha) => acc + linha.quantidade * linha.precoUnitario, 0)
  const totalIva = linhas.reduce(
    (acc, linha) => acc + linha.quantidade * linha.precoUnitario * (linha.taxaIva / 100),
    0,
  )
  return { subtotal, totalIva, total: subtotal + totalIva }
}
