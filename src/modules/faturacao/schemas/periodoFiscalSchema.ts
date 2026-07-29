import { z } from 'zod'

/** Omitido/0 = período cobre o ano inteiro; 1-12 = cobre só o mês. */
export const periodoFiscalSchema = z.object({
  anoFiscal: z.number().int().min(2000).max(2100),
  mes: z.number().int().min(1).max(12).nullable().optional(),
})

export type PeriodoFiscalFormValues = z.infer<typeof periodoFiscalSchema>
