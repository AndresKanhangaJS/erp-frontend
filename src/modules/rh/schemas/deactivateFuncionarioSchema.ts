import { z } from 'zod'

export const deactivateFuncionarioSchema = z.object({
  motivo: z.string().min(1, 'O motivo é obrigatório').max(500),
  dataCessacao: z.string().nullable(),
})

export type DeactivateFuncionarioFormValues = z.infer<typeof deactivateFuncionarioSchema>
