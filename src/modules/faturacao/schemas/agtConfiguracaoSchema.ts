import { z } from 'zod'

/**
 * Todos os campos opcionais, espelhando UpdateAgtConfiguracaoRequest
 * (erp-api): a configuração pode ser preenchida por etapas (ex.:
 * credenciais primeiro, chave depois). Campos de credenciais em branco
 * significam "não alterar" — nunca são enviados vazios (ver
 * updateAgtConfiguracao em api/modules/faturacao.ts), porque o backend
 * nunca devolve o valor actual para os reapresentar no formulário.
 */
export const agtConfiguracaoSchema = z.object({
  nifEmitente: z.string(),
  establishmentNumber: z.string(),
  eacCode: z.string(),
  codigoIsencaoPadrao: z.string(),
  ambiente: z.enum(['hml', 'prd']),
  activa: z.boolean(),
  username: z.string(),
  password: z.string(),
  chavePrivadaPem: z.string(),
  certificadoPem: z.string(),
})

export type AgtConfiguracaoFormValues = z.infer<typeof agtConfiguracaoSchema>
