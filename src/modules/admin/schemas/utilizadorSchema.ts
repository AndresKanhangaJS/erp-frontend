import { z } from 'zod'

import { USER_ROLES } from '../types'

export const utilizadorSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório').max(255),
  email: z.string().min(1, 'O email é obrigatório').email('Email inválido'),
  role: z.enum(USER_ROLES as [string, ...string[]], { message: 'Selecciona uma role' }),
})

export type UtilizadorFormValues = z.infer<typeof utilizadorSchema>
