import { z } from 'zod'

const TIPOS_CONTA = ['activo', 'passivo', 'capital_proprio', 'proveito', 'custo'] as const

export const contaSchema = z.object({
  codigo: z
    .string()
    .min(1, 'O código é obrigatório')
    .regex(/^[1-8](\.\d+)*$/, 'Usa a estrutura decimal por classe (ex.: 1.1.01)'),
  designacao: z.string().min(1, 'A designação é obrigatória'),
  tipo: z.enum(TIPOS_CONTA, { message: 'Selecciona um tipo de conta' }),
  contaPaiId: z.string().nullable(),
  permiteLancamentos: z.boolean(),
})

export type ContaFormValues = z.infer<typeof contaSchema>
