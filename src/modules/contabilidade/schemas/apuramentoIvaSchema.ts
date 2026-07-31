import { z } from 'zod'

export const apurarIvaSchema = z.object({
  periodoId: z.string().min(1, 'Selecciona um período'),
})

export type ApurarIvaFormValues = z.infer<typeof apurarIvaSchema>
