import { z } from 'zod'

export const actividadeSchema = z.object({
  tipo: z.enum(['chamada', 'email', 'reuniao', 'nota']),
  descricao: z.string().min(1, 'A descrição é obrigatória').max(2000),
  data: z.string().nullable(),
  relacionadoTipo: z.enum(['lead', 'oportunidade']),
  relacionadoId: z.string().min(1),
})

export type ActividadeFormValues = z.infer<typeof actividadeSchema>
