import { z } from 'zod'

/**
 * Anular uma factura gera uma Nota de Crédito real (nunca apaga nem
 * esconde o original — ADR-008) — por isso precisa de uma série de NC
 * para numerar essa contra-entrada, e de um motivo (AnularFaturaRequest).
 */
export const anularFaturaSchema = z.object({
  serieNcId: z.string().min(1, 'Selecciona a série da nota de crédito'),
  motivo: z.string().min(1, 'O motivo é obrigatório').max(500),
})

export type AnularFaturaFormValues = z.infer<typeof anularFaturaSchema>
