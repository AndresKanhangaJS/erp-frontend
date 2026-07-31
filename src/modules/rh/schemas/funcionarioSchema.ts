import { z } from 'zod'

/** dataAdmissao só existe na criação — depois de admitido não se muda a data de entrada. */
export const funcionarioSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório').max(255),
  nif: z.string().trim().nullable(),
  numeroSegurancaSocial: z.string().trim().nullable(),
  cargo: z.string().min(1, 'O cargo é obrigatório').max(255),
  departamento: z.string().trim().nullable(),
  dataAdmissao: z.string().min(1, 'A data de admissão é obrigatória'),
  salarioBase: z.number().nonnegative('O salário base não pode ser negativo'),
  subsidioAlimentacao: z.number().nonnegative().nullable(),
  subsidioTransporte: z.number().nonnegative().nullable(),
})

export type FuncionarioFormValues = z.infer<typeof funcionarioSchema>
