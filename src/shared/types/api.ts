/**
 * Wrappers do formato de resposta do backend Laravel (../erp-api).
 * Ver contrato completo no briefing do projecto.
 */

export interface ApiSuccessResponse<T> {
  data: T
  message?: string
  meta?: Record<string, unknown>
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}

/**
 * Forma unificada dos corpos de erro 422/409/403. Os três casos partilham
 * "message"; "errors" só aparece no 422 (validação), "error" só aparece
 * no 409 (regra de negócio) e no 403 (permissão/módulo inactivo).
 */
export interface ApiErrorBody {
  message: string
  errors?: Record<string, string[]>
  error?: {
    code: string
    module?: string
    required?: string
    required_plan?: string
    details?: unknown
  }
}
