import { z } from 'zod'

export const oportunidadeSchema = z.object({
  leadId: z.string().min(1, 'Selecciona um lead'),
  titulo: z.string().min(1, 'O título é obrigatório').max(255),
  valorEstimado: z.number().nonnegative('O valor não pode ser negativo'),
  probabilidade: z.number().int().min(0).max(100).nullable(),
  pipelineEstagioId: z.string().nullable(),
  dataFechoPrevista: z.string().nullable(),
})

export type OportunidadeFormValues = z.infer<typeof oportunidadeSchema>
