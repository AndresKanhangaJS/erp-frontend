import { z } from 'zod'

export const desactivarUtilizadorSchema = z.object({
  reason: z.string().min(1, 'O motivo é obrigatório').max(500),
})

export type DesactivarUtilizadorFormValues = z.infer<typeof desactivarUtilizadorSchema>
