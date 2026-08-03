import { z } from 'zod'

import { passwordPolicySchema } from '@/modules/auth/schemas/passwordPolicy'

export const registerTenantSchema = z
  .object({
    nomeEmpresa: z.string().min(1, 'O nome da empresa é obrigatório').max(255),
    nif: z.string().nullable(),
    adminNome: z.string().min(1, 'O teu nome é obrigatório').max(255),
    adminEmail: z.string().min(1, 'O email é obrigatório').email('Email inválido'),
    adminPassword: passwordPolicySchema,
    adminPasswordConfirmation: z.string().min(1, 'Confirma a password'),
    plano: z.enum(['starter', 'growth', 'pro'], { message: 'Escolhe um plano' }),
  })
  .refine((data) => data.adminPassword === data.adminPasswordConfirmation, {
    message: 'As passwords não coincidem',
    path: ['adminPasswordConfirmation'],
  })

export type RegisterTenantFormValues = z.infer<typeof registerTenantSchema>
