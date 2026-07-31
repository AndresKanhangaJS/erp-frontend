import { z } from 'zod'

/** Só entrada/saída directas aqui — ajuste nasce de um inventário fechado, transferência tem o seu próprio fluxo. */
export const movimentoSchema = z.object({
  armazemId: z.string().min(1, 'Selecciona um armazém'),
  artigoId: z.string().min(1, 'Selecciona um artigo'),
  tipo: z.enum(['entrada', 'saida']),
  quantidade: z.number().positive('A quantidade deve ser maior que zero'),
  custoUnitario: z.number().nonnegative().nullable(),
  observacoes: z.string().trim().nullable(),
})

export type MovimentoFormValues = z.infer<typeof movimentoSchema>
