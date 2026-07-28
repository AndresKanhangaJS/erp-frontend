import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AvisoNIF } from './AvisoNIF'

describe('AvisoNIF', () => {
  it('mostra o aviso quando total >= 50.000 AOA e o cliente não tem NIF', () => {
    render(<AvisoNIF total={50000} moeda="AOA" clienteTemNif={false} />)
    expect(screen.getByText('NIF do cliente em falta')).toBeInTheDocument()
  })

  it('não mostra nada quando o cliente tem NIF', () => {
    render(<AvisoNIF total={100000} moeda="AOA" clienteTemNif={true} />)
    expect(screen.queryByText('NIF do cliente em falta')).not.toBeInTheDocument()
  })

  it('não mostra nada quando o total é inferior a 50.000 AOA', () => {
    render(<AvisoNIF total={49999.99} moeda="AOA" clienteTemNif={false} />)
    expect(screen.queryByText('NIF do cliente em falta')).not.toBeInTheDocument()
  })

  it('não mostra nada para moeda diferente de AOA (sem taxa de câmbio confirmada)', () => {
    render(<AvisoNIF total={100000} moeda="USD" clienteTemNif={false} />)
    expect(screen.queryByText('NIF do cliente em falta')).not.toBeInTheDocument()
  })
})
