import { describe, expect, it, vi } from 'vitest'

import { applyApiErrorsToForm, extractValidationErrors, getApiErrorMessage } from './mapApiErrors'

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

describe('getApiErrorMessage', () => {
  it('devolve a mensagem real do backend, seja qual for o estado HTTP', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: { message: 'O tenant indicado não foi encontrado.', code: 'TENANT_NOT_FOUND' },
      },
    }
    expect(getApiErrorMessage(error, 'fallback')).toBe('O tenant indicado não foi encontrado.')
  })

  it('devolve o fallback quando nao ha mensagem do backend', () => {
    const error = { isAxiosError: true, response: { status: 500, data: {} } }
    expect(getApiErrorMessage(error, 'fallback')).toBe('fallback')
  })

  it('devolve o fallback para algo que nao e um AxiosError', () => {
    expect(getApiErrorMessage(new Error('falha qualquer'), 'fallback')).toBe('fallback')
  })
})
