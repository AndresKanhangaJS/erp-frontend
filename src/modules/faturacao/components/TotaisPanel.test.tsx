import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TotaisPanel } from './TotaisPanel'

describe('TotaisPanel', () => {
  it('mostra subtotal, IVA e total formatados', () => {
    render(<TotaisPanel subtotal={1000} totalIva={140} total={1140} />)

    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    expect(screen.getByText('IVA')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
    // Intl.NumberFormat('pt-AO', ...) usa o símbolo "Kz" e um espaço
    // especial como separador de milhares (ex.: "1 140,00 Kz"), não
    // "AOA" nem um ponto — daí o matcher flexível.
    expect(
      screen.getAllByText((content) => content.includes('140,00') && content.includes('Kz'))[0],
    ).toBeInTheDocument()
  })

  it('não mostra a taxa de câmbio para AOA', () => {
    render(<TotaisPanel subtotal={1000} totalIva={140} total={1140} moeda="AOA" taxaCambio={850} />)
    expect(screen.queryByText(/Taxa de câmbio/)).not.toBeInTheDocument()
  })

  it('mostra a taxa de câmbio para moedas estrangeiras quando fornecida', () => {
    render(<TotaisPanel subtotal={100} totalIva={14} total={114} moeda="USD" taxaCambio={850} />)
    expect(screen.getByText(/Taxa de câmbio: 1 USD = 850.00 AOA/)).toBeInTheDocument()
  })
})
