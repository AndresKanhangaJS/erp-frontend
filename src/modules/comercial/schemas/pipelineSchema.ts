import { z } from 'zod'

export const pipelineSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório').max(255),
  estagios: z
    .array(
      z.object({
        nome: z.string().min(1, 'O nome do estágio é obrigatório').max(255),
        tipo: z.enum(['aberto', 'ganho', 'perdido']),
      }),
    )
    .min(2, 'Um pipeline precisa de pelo menos 2 estágios'),
})

export type PipelineFormValues = z.infer<typeof pipelineSchema>
