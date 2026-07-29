import { z } from 'zod'

/**
 * Sem .transform(): o zodResolver exige que o tipo de entrada e de
 * saída do schema batam certo com TFieldValues do useForm — um
 * .transform() (ex.: "" -> null) quebra essa igualdade e o tsc
 * rejeita a ligação schema<->form. A normalização "'' vira null" fica
 * a cargo do onChange de cada campo no formulário.
 */
export const clienteSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  nif: z.string().trim().toUpperCase().nullable(),
  email: z.union([z.string().trim().email('Email inválido'), z.null()]),
  telefone: z.string().trim().nullable(),
  morada: z.string().trim().nullable(),
})

export type ClienteFormValues = z.infer<typeof clienteSchema>
