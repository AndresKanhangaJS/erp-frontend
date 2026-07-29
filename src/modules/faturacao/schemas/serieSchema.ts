import { z } from 'zod'

/** Ao contrário da emissão, aqui aceitam-se os 6 tipos — inclui NC/ND porque anular precisa de uma série própria para a contra-entrada. */
export const serieSchema = z.object({
  tipoDocumento: z.enum(['FT', 'FR', 'NC', 'ND', 'VD', 'RC']),
  codigo: z.string().min(1, 'O código é obrigatório').max(50),
  anoFiscal: z.number().int().min(2000).max(2100),
})

export type SerieFormValues = z.infer<typeof serieSchema>
