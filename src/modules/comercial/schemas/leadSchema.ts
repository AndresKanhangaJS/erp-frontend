import { z } from 'zod'

/**
 * Um único schema para criar e editar: origem só é aceite na criação
 * (CreateLeadRequest), estado só na edição (UpdateLeadRequest) — o
 * formulário mostra um ou outro consoante o modo, e o api/modules só
 * envia o subconjunto certo para cada operação.
 */
export const leadSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório').max(255),
  empresa: z.string().trim().nullable(),
  email: z.union([z.string().trim().email('Email inválido'), z.null()]),
  telefone: z.string().trim().nullable(),
  origem: z.enum(['manual', 'website', 'referencia', 'cold_call']),
  estado: z.enum(['novo', 'contactado', 'qualificado', 'desqualificado']),
})

export type LeadFormValues = z.infer<typeof leadSchema>
