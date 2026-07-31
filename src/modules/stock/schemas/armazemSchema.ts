import { z } from 'zod'

export const armazemSchema = z.object({
  codigo: z.string().min(1, 'O código é obrigatório').max(50),
  nome: z.string().min(1, 'O nome é obrigatório').max(255),
  endereco: z.string().trim().nullable(),
})

export type ArmazemFormValues = z.infer<typeof armazemSchema>
