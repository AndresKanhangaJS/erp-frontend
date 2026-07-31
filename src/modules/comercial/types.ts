export type OrigemLead = 'manual' | 'website' | 'referencia' | 'cold_call'
export type EstadoLead = 'novo' | 'contactado' | 'qualificado' | 'desqualificado'

export interface Lead {
  id: string
  nome: string
  empresa: string | null
  email: string | null
  telefone: string | null
  origem: OrigemLead
  estado: EstadoLead
  /** Preenchido quando o lead é convertido num cliente de Facturação. */
  faturacaoClienteId: string | null
}

export type TipoEstagioPipeline = 'aberto' | 'ganho' | 'perdido'

export interface PipelineEstagio {
  id: string
  nome: string
  ordem: number
  tipo: TipoEstagioPipeline
}

export interface Pipeline {
  id: string
  nome: string
  isPadrao: boolean
  estagios: PipelineEstagio[]
}

export interface Oportunidade {
  id: string
  leadId: string
  titulo: string
  valorEstimado: number
  /** 0-100. */
  probabilidade: number
  pipelineEstagioId: string
  dataFechoPrevista: string | null
  dataFechamento: string | null
  /** Preenchido quando a oportunidade é ganha e gera uma factura. */
  faturacaoClienteId: string | null
}

export type TipoActividadeCrm = 'chamada' | 'email' | 'reuniao' | 'nota'
export type RelacionadoTipo = 'lead' | 'oportunidade'

export interface ActividadeCrm {
  id: string
  tipo: TipoActividadeCrm
  descricao: string
  data: string
  relacionadoTipo: RelacionadoTipo
  relacionadoId: string
}
