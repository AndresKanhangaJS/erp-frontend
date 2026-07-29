import { z } from 'zod'

/**
 * Espelha a validação do backend — é só UX, o backend valida sempre
 * (ADR-004). Duas regras fundamentais de partidas dobradas:
 * cada linha tem débito OU crédito (nunca os dois, nunca nenhum), e
 * a soma de débitos tem de bater com a soma de créditos no lançamento
 * inteiro — sem isto o lançamento simplesmente não é válido em
 * contabilidade, não é uma preferência de UX.
 */
const linhaLancamentoSchema = z
  .object({
    contaId: z.string().min(1, 'Selecciona uma conta'),
    contaCodigo: z.string(),
    contaDesignacao: z.string(),
    debito: z.number().nonnegative('O valor não pode ser negativo'),
    credito: z.number().nonnegative('O valor não pode ser negativo'),
  })
  .superRefine((linha, ctx) => {
    const temDebito = linha.debito > 0
    const temCredito = linha.credito > 0
    if (temDebito === temCredito) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['debito'],
        message: 'Preenche exactamente um dos valores: débito ou crédito',
      })
    }
  })

export const lancamentoSchema = z
  .object({
    data: z.string().min(1, 'A data é obrigatória'),
    descricao: z.string().min(1, 'A descrição é obrigatória'),
    periodoId: z.string().min(1, 'Selecciona um período'),
    linhas: z.array(linhaLancamentoSchema).min(2, 'Um lançamento precisa de pelo menos 2 linhas'),
  })
  .superRefine((values, ctx) => {
    const totalDebito = values.linhas.reduce((acc, linha) => acc + linha.debito, 0)
    const totalCredito = values.linhas.reduce((acc, linha) => acc + linha.credito, 0)

    if (Math.abs(totalDebito - totalCredito) > 0.005) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['linhas'],
        message: `O lançamento não está equilibrado: débito ${totalDebito.toFixed(2)} ≠ crédito ${totalCredito.toFixed(2)}`,
      })
    }
  })

export type LancamentoFormValues = z.infer<typeof lancamentoSchema>
