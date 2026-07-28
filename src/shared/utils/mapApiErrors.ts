import axios from 'axios'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

import type { ApiErrorBody } from '@/shared/types/api'

/**
 * Extrai o mapa de erros de validação de um 422 do backend.
 * Devolve null para qualquer outro caso (não é AxiosError, não é 422,
 * ou o corpo não trouxe "errors").
 */
export function extractValidationErrors(error: unknown): Record<string, string[]> | null {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return null
  }
  if (error.response?.status !== 422) {
    return null
  }
  return error.response.data?.errors ?? null
}

/**
 * Mapeia um 422 do backend para setError() do React Hook Form — a
 * validação Zod no cliente é só UX, o backend valida sempre (ADR-004).
 * Devolve true se encontrou e aplicou erros de validação, false caso
 * contrário (o chamador deve então mostrar um erro genérico/toast).
 */
export function applyApiErrorsToForm<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean {
  const errors = extractValidationErrors(error)
  if (!errors) {
    return false
  }

  for (const [field, messages] of Object.entries(errors)) {
    const message = messages[0]
    if (message) {
      setError(field as Path<T>, { type: 'server', message })
    }
  }

  return true
}
