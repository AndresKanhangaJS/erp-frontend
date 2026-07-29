import { z } from 'zod'

export const pagamentoSchema = z.object({
  valor: z.number().positive('O valor deve ser maior que zero'),
  metodo: z.enum(['transferencia', 'numerario', 'outro']),
  referencia: z.string().max(255).nullable().optional(),
  dataPagamento: z.string().nullable().optional(),
})

export type PagamentoFormValues = z.infer<typeof pagamentoSchema>
