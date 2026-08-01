import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  tenantId: z.string().min(1, 'O ID do tenant é obrigatório'),
  email: z.string().min(1, 'O email é obrigatório').email('Email inválido'),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
