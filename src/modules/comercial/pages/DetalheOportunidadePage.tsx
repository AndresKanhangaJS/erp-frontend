import { Percent, Wallet } from 'lucide-react'
import { useParams } from 'react-router'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { StatCard } from '@/shared/components/ui/StatCard'
import { formatDate } from '@/shared/utils/formatDate'

import { ActividadesTimeline } from '../components/ActividadesTimeline'
import { useLead } from '../hooks/useLead'
import { useMoverEstagioOportunidade } from '../hooks/useMoverEstagioOportunidade'
import { useOportunidade } from '../hooks/useOportunidade'
import { usePipelines } from '../hooks/usePipelines'

export default function DetalheOportunidadePage() {
  const { id } = useParams()
  const { data: oportunidade, isLoading } = useOportunidade(id)
  const { data: lead } = useLead(oportunidade?.leadId)
  const { data: pipelines } = usePipelines()
  const moverEstagio = useMoverEstagioOportunidade()

  if (isLoading || !oportunidade) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const pipeline = (pipelines ?? []).find((p) =>
    p.estagios.some((estagio) => estagio.id === oportunidade.pipelineEstagioId),
  )

  return (
    <div className="max-w-xl space-y-8">
      <div className="space-y-6">
        <PageHeader
          title={oportunidade.titulo}
          breadcrumbs={[
            { label: 'Comercial', href: '/comercial' },
            { label: 'Oportunidades', href: '/comercial/oportunidades' },
            { label: oportunidade.titulo },
          ]}
        />

        <Card>
          <CardContent>
            <p className="text-sm text-text-secondary">Lead</p>
            <p className="font-medium text-text-primary">{lead?.nome ?? '—'}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Valor estimado"
            value={<CurrencyDisplay value={oportunidade.valorEstimado} />}
            icon={Wallet}
            tone="accent"
          />
          <StatCard
            label="Probabilidade"
            value={`${oportunidade.probabilidade}%`}
            icon={Percent}
            tone="info"
          />
        </div>

        {oportunidade.dataFechoPrevista && (
          <p className="text-sm text-text-muted">
            Fecho previsto: {formatDate(oportunidade.dataFechoPrevista)}
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="estagio" className="text-sm text-text-secondary">
            Estágio
          </label>
          <Select
            value={oportunidade.pipelineEstagioId}
            onValueChange={(next) =>
              moverEstagio.mutate({ id: oportunidade.id, pipelineEstagioId: next })
            }
            disabled={moverEstagio.isPending}
          >
            <SelectTrigger id="estagio" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(pipeline?.estagios ?? []).map((estagio) => (
                <SelectItem key={estagio.id} value={estagio.id}>
                  {estagio.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ActividadesTimeline relacionadoTipo="oportunidade" relacionadoId={oportunidade.id} />
    </div>
  )
}
