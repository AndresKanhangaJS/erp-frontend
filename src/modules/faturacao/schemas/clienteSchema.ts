import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  nif: z
    .string()
    .trim()
    .toUpperCase()
    .nullable()
    .optional()
    .transform((value) => (value ? value : null)),
  email: z
    .string()
    .trim()
    .email('Email inválido')
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  telefone: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => (value ? value : null)),
})

export type ClienteFormValues = z.infer<typeof clienteSchema>
