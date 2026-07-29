import { z } from 'zod'

export const saftSchema = z.object({
  anoFiscal: z.number().int().min(2000).max(2100),
  mes: z.number().int().min(1).max(12).nullable().optional(),
})

export type SaftFormValues = z.infer<typeof saftSchema>
