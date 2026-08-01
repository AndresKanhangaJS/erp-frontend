import { z } from 'zod'

/**
 * Espelha App\Shared\Specs\PasswordPolicySpec (erp-api): mínimo 10
 * caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo. Validação
 * aqui é só UX — o backend valida sempre (ADR-004).
 */
export const passwordPolicySchema = z
  .string()
  .min(10, 'A senha deve ter pelo menos 10 caracteres')
  .refine((value) => /\p{Lu}/u.test(value), 'A senha deve ter pelo menos uma letra maiúscula')
  .refine((value) => /\p{Ll}/u.test(value), 'A senha deve ter pelo menos uma letra minúscula')
  .refine((value) => /\d/.test(value), 'A senha deve ter pelo menos um número')
  .refine(
    (value) => /[^\p{L}\p{N}]/u.test(value),
    'A senha deve ter pelo menos um símbolo (ex.: ! ? # @)',
  )
