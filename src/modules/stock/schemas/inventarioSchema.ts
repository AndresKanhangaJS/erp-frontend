import { z } from 'zod'

/**
 * O cliente só indica artigo + quantidade contada fisicamente — código/
 * nome do artigo e a quantidade de sistema são resolvidos no servidor,
 * nunca aceites do pedido (CriarInventarioAgent).
 */
const linhaInventarioSchema = z.object({
  artigoId: z.string().min(1, 'Selecciona um artigo'),
  artigoCodigo: z.string(),
  artigoNome: z.string(),
  quantidadeContada: z.number().nonnegative('A quantidade não pode ser negativa'),
})

export const inventarioSchema = z.object({
  armazemId: z.string().min(1, 'Selecciona um armazém'),
  observacoes: z.string().trim().nullable(),
  linhas: z.array(linhaInventarioSchema).min(1, 'Adiciona pelo menos um artigo'),
})

export type InventarioFormValues = z.infer<typeof inventarioSchema>
