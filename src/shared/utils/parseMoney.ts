/** Forma como o backend real devolve valores monetários (nunca um número puro). */
export interface MoneyWire {
  amount: string
  currency: string
}

/**
 * Converte o wire format do backend para o número que o resto do
 * domínio usa. A precisão de cálculo fiscal vive sempre no backend
 * (Brick\Money) — isto é só para apresentação no frontend.
 */
export function parseMoney(money: MoneyWire | null | undefined): number {
  return money ? Number(money.amount) : 0
}
