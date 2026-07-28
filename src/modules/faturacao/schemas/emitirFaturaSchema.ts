import { z } from 'zod'

/**
 * Espelha a validação do backend — é só UX, o backend valida sempre
 * (ADR-004). O aviso de NIF em falta para totais ≥ 50.000 AOA é
 * intencionalmente um aviso (AvisoNIF), não um bloqueio aqui: a AGT
 * exige o NIF nesses casos, mas quem decide se avança é o utilizador.
 */
export const linhaDocumentoSchema = z
  .object({
    artigoId: z.string().min(1, 'Selecciona um artigo'),
    designacao: z.string().min(1),
    quantidade: z.number().positive('A quantidade deve ser maior que zero'),
    precoUnitario: z.number().nonnegative('O preço não pode ser negativo'),
    taxaIva: z.union([z.literal(0), z.literal(14)]),
    motivoIsencao: z.string().trim().nullable().optional(),
  })
  .superRefine((linha, ctx) => {
    if (linha.taxaIva === 0 && !linha.motivoIsencao) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['motivoIsencao'],
        message: 'Motivo de isenção obrigatório quando o IVA é 0%',
      })
    }
  })

export const emitirFaturaSchema = z.object({
  tipo: z.enum(['FT', 'FR', 'NC', 'ND', 'VD', 'RC']),
  clienteId: z.string().min(1, 'Selecciona um cliente'),
  moeda: z.enum(['AOA', 'USD', 'EUR']),
  linhas: z.array(linhaDocumentoSchema).min(1, 'Adiciona pelo menos uma linha'),
})

export type EmitirFaturaFormValues = z.infer<typeof emitirFaturaSchema>
