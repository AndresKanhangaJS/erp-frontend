import { z } from 'zod'

/** Ao contrário da Facturação, um período contabilístico exige sempre um mês — não há "ano inteiro". */
export const periodoSchema = z.object({
  anoFiscal: z.number().int().min(2000).max(2100),
  mes: z.number().int().min(1).max(12),
})

export type PeriodoFormValues = z.infer<typeof periodoSchema>
