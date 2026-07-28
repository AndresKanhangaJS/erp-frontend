import { useAuthStore } from '@/shared/stores/authStore'

/**
 * Verificação de permissão no cliente é só para UX (esconder acções) —
 * o backend rejeita sempre, o cliente nunca é a fonte de verdade (ADR-007).
 */
export function usePermission(permission: string): boolean {
  return useAuthStore((state) => state.permissions.includes(permission))
}
