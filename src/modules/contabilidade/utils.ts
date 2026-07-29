import type { Conta, LinhaLancamento } from './types'

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

export interface ContaComProfundidade {
  conta: Conta
  profundidade: number
}

/**
 * Achata o plano de contas (flat, com contaPaiId) numa lista em ordem de
 * árvore (pré-ordem, por código dentro de cada nível), com a profundidade
 * de cada conta para indentação visual.
 */
export function achatarArvoreContas(contas: Conta[]): ContaComProfundidade[] {
  const filhosPorPai = new Map<string | null, Conta[]>()
  for (const conta of contas) {
    const filhos = filhosPorPai.get(conta.contaPaiId) ?? []
    filhos.push(conta)
    filhosPorPai.set(conta.contaPaiId, filhos)
  }
  for (const filhos of filhosPorPai.values()) {
    filhos.sort((a, b) => a.codigo.localeCompare(b.codigo))
  }

  function visitar(paiId: string | null, profundidade: number): ContaComProfundidade[] {
    const filhos = filhosPorPai.get(paiId) ?? []
    return filhos.flatMap((conta) => [
      { conta, profundidade },
      ...visitar(conta.id, profundidade + 1),
    ])
  }

  return visitar(null, 0)
}
