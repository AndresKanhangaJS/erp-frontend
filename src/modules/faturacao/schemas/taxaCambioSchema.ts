import { z } from 'zod'

/** AOA nunca tem taxa própria (é sempre a moeda base — TaxaCambioService::obterTaxa). */
export const taxaCambioSchema = z.object({
  moeda: z.enum(['USD', 'EUR']),
  taxa: z.number().positive('A taxa deve ser maior que zero'),
  data: z.string().min(1, 'A data é obrigatória'),
})

export type TaxaCambioFormValues = z.infer<typeof taxaCambioSchema>
