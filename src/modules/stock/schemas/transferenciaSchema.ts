import { z } from 'zod'

export const transferenciaSchema = z
  .object({
    armazemOrigemId: z.string().min(1, 'Selecciona o armazém de origem'),
    armazemDestinoId: z.string().min(1, 'Selecciona o armazém de destino'),
    artigoId: z.string().min(1, 'Selecciona um artigo'),
    quantidade: z.number().positive('A quantidade deve ser maior que zero'),
    observacoes: z.string().trim().nullable(),
  })
  .superRefine((values, ctx) => {
    if (values.armazemOrigemId && values.armazemOrigemId === values.armazemDestinoId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['armazemDestinoId'],
        message: 'O armazém de destino tem de ser diferente do de origem',
      })
    }
  })

export type TransferenciaFormValues = z.infer<typeof transferenciaSchema>
