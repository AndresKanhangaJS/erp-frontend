import { z } from 'zod'

export const artigoSchema = z.object({
  codigo: z.string().min(1, 'O código é obrigatório').max(50),
  nome: z.string().min(1, 'O nome é obrigatório').max(255),
  precoUnitario: z.number().nonnegative('O preço não pode ser negativo'),
  moeda: z.enum(['AOA', 'USD', 'EUR']).nullable().optional(),
  /** Fracção, não percentagem — 0.14 representa 14%. */
  taxaIva: z.number().min(0).max(1).nullable().optional(),
  unidade: z.string().max(20).nullable().optional(),
})

export type ArtigoFormValues = z.infer<typeof artigoSchema>
