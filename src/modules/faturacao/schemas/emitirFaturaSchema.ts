import { z } from 'zod'

/**
 * Espelha a validação do backend (EmitirFaturaRequest) — é só UX, o
 * backend valida sempre (ADR-004). Cada linha precisa de um artigo OU
 * de um preço unitário explícito (regra de negócio PRECO_OBRIGATORIO
 * no EmitirFaturaAgent, não uma regra de 422 da Request) — a descrição
 * é sempre livre, o artigo é só um atalho para pré-preencher.
 */
export const linhaFaturaSchema = z
  .object({
    artigoId: z.string().nullable().optional(),
    descricao: z.string().min(1, 'A descrição é obrigatória').max(255),
    quantidade: z.number().positive('A quantidade deve ser maior que zero'),
    precoUnitario: z.number().nonnegative('O preço não pode ser negativo').nullable().optional(),
    taxaIva: z.number().min(0).max(1),
  })
  .superRefine((linha, ctx) => {
    if (!linha.artigoId && (linha.precoUnitario === null || linha.precoUnitario === undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['precoUnitario'],
        message: 'Indica o preço unitário ou selecciona um artigo com preço.',
      })
    }
  })

export const emitirFaturaSchema = z.object({
  serieId: z.string().min(1, 'Selecciona uma série'),
  /** NC/ND excluídos de propósito — só se emitem via anular. */
  tipoDocumento: z.enum(['FT', 'FR', 'VD', 'RC']),
  clienteId: z.string().nullable().optional(),
  moeda: z.enum(['AOA', 'USD', 'EUR']).nullable().optional(),
  taxaCambio: z.number().positive().nullable().optional(),
  linhas: z.array(linhaFaturaSchema).min(1, 'Adiciona pelo menos uma linha'),
})

export type EmitirFaturaFormValues = z.infer<typeof emitirFaturaSchema>
