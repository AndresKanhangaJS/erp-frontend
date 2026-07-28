export type TipoDocumento = 'FT' | 'FR' | 'NC' | 'ND' | 'VD' | 'RC'
export type EstadoDocumento = 'rascunho' | 'emitido' | 'anulado'

/**
 * A comunicação à AGT é uma exigência legal separada do ciclo de vida
 * do documento em si — um documento pode estar "emitido" e ainda
 * "pendente" de comunicação (o backend comunica de forma assíncrona).
 */
export type EstadoComunicacaoAgt = 'pendente' | 'comunicado' | 'erro'

export interface ComunicacaoAgt {
  estado: EstadoComunicacaoAgt
  /** Hash de encadeamento com o documento anterior da série. */
  hash: string | null
  /** Código de verificação (equivalente ao ATCUD) impresso no documento. */
  codigoVerificacao: string | null
  /** Payload/URL codificado no QR code do documento. */
  qrCodeData: string | null
  dataComunicacao: string | null
}

export interface Cliente {
  id: string
  nome: string
  nif: string | null
  email: string | null
  telefone: string | null
}

export interface Artigo {
  id: string
  codigo: string
  designacao: string
  precoUnitario: number
  taxaIva: 0 | 14
}

export interface LinhaDocumento {
  artigoId: string
  designacao: string
  quantidade: number
  precoUnitario: number
  taxaIva: 0 | 14
  motivoIsencao?: string | null
}

export type Moeda = 'AOA' | 'USD' | 'EUR'

export interface DocumentoFiscal {
  id: string
  tipo: TipoDocumento
  /** Formato SERIE/NNNNNN. */
  numero: string
  serie: string
  estado: EstadoDocumento
  cliente: Cliente
  linhas: LinhaDocumento[]
  subtotal: number
  totalIva: number
  total: number
  moeda: Moeda
  taxaCambio: number | null
  comunicacaoAgt: ComunicacaoAgt
  dataEmissao: string
  createdAt: string
}
