import { z } from 'zod'

import { passwordPolicySchema } from './passwordPolicy'

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'A senha actual é obrigatória'),
    password: passwordPolicySchema,
    passwordConfirmation: z.string().min(1, 'Confirma a nova senha'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'As senhas não coincidem',
    path: ['passwordConfirmation'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
