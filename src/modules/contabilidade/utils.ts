import type { LinhaLancamento } from './types'

export interface SaldoLancamentoCalculado {
  totalDebito: number
  totalCredito: number
  diferenca: number
  equilibrado: boolean
}

export function calcularSaldoLancamento(linhas: LinhaLancamento[]): SaldoLancamentoCalculado {
  const totalDebito = linhas.reduce((acc, linha) => acc + linha.debito, 0)
  const totalCredito = linhas.reduce((acc, linha) => acc + linha.credito, 0)
  const diferenca = totalDebito - totalCredito

  return {
    totalDebito,
    totalCredito,
    diferenca,
    equilibrado: Math.abs(diferenca) < 0.005,
  }
}
