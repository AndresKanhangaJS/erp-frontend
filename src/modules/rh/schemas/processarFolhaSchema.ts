import { z } from 'zod'

export const processarFolhaSchema = z.object({
  anoFiscal: z.number().int().min(2000).max(2100),
  mes: z.number().int().min(1).max(12),
})

export type ProcessarFolhaFormValues = z.infer<typeof processarFolhaSchema>
