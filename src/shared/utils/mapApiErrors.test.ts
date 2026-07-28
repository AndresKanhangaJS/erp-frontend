import { describe, expect, it, vi } from 'vitest'

import { applyApiErrorsToForm, extractValidationErrors } from './mapApiErrors'

function make422(errors: Record<string, string[]>) {
  return {
    isAxiosError: true,
    response: {
      status: 422,
      data: { message: 'Dados inválidos', errors },
    },
  }
}

describe('extractValidationErrors', () => {
  it('extrai os erros de um 422', () => {
    const error = make422({ nif: ['NIF inválido'] })
    expect(extractValidationErrors(error)).toEqual({ nif: ['NIF inválido'] })
  })

  it('devolve null para erros que nao sao 422', () => {
    const error = { isAxiosError: true, response: { status: 500, data: {} } }
    expect(extractValidationErrors(error)).toBeNull()
  })

  it('devolve null para algo que nao e um AxiosError', () => {
    expect(extractValidationErrors(new Error('falha qualquer'))).toBeNull()
  })
})

describe('applyApiErrorsToForm', () => {
  it('chama setError para cada campo e devolve true', () => {
    const error = make422({
      nif: ['NIF inválido'],
      total: ['O total deve ser maior que zero'],
    })
    const setError = vi.fn()

    const result = applyApiErrorsToForm(error, setError)

    expect(result).toBe(true)
    expect(setError).toHaveBeenCalledWith('nif', { type: 'server', message: 'NIF inválido' })
    expect(setError).toHaveBeenCalledWith('total', {
      type: 'server',
      message: 'O total deve ser maior que zero',
    })
  })

  it('devolve false e nao chama setError quando nao ha erros de validacao', () => {
    const error = { isAxiosError: true, response: { status: 500, data: {} } }
    const setError = vi.fn()

    expect(applyApiErrorsToForm(error, setError)).toBe(false)
    expect(setError).not.toHaveBeenCalled()
  })
})
