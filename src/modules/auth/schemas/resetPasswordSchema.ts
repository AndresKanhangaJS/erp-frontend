import { z } from 'zod'

import { passwordPolicySchema } from './passwordPolicy'

export const resetPasswordSchema = z
  .object({
    tenantId: z.string().min(1, 'O ID do tenant é obrigatório'),
    password: passwordPolicySchema,
    passwordConfirmation: z.string().min(1, 'Confirma a nova senha'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'As senhas não coincidem',
    path: ['passwordConfirmation'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
