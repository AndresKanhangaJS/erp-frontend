import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { getApiErrorMessage } from '@/shared/utils/mapApiErrors'

import { LinhasLancamentoEditor } from '../components/LinhasLancamentoEditor'
import { PeriodoPicker } from '../components/PeriodoPicker'
import { SaldoLancamento } from '../components/SaldoLancamento'
import { useCriarLancamento } from '../hooks/useCriarLancamento'
import { lancamentoSchema, type LancamentoFormValues } from '../schemas/lancamentoSchema'
import { calcularSaldoLancamento } from '../utils'

export default function NovoLancamentoPage() {
  const navigate = useNavigate()
  const criar = useCriarLancamento()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LancamentoFormValues>({
    resolver: zodResolver(lancamentoSchema),
    defaultValues: { data: '', descricao: '', periodoId: '', linhas: [] },
  })

  const linhas = useWatch({ control, name: 'linhas' })
  const saldo = calcularSaldoLancamento(linhas ?? [])

  function onSubmit(values: LancamentoFormValues) {
    criar.mutate(values, {
      onSuccess: (lancamento) => navigate(`/contabilidade/lancamentos/${lancamento.id}`),
      onError: (error) => {
        setError('root', {
          message: getApiErrorMessage(error, 'Não foi possível criar o lançamento.'),
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <PageHeader
        title="Novo lançamento"
        breadcrumbs={[
          { label: 'Contabilidade', href: '/contabilidade' },
          { label: 'Lançamentos', href: '/contabilidade/lancamentos' },
          { label: 'Novo' },
        ]}
        actions={
          <PermissionGuard permission="contabilidade.lancar">
            <Button type="submit" disabled={isSubmitting || criar.isPending || !saldo.equilibrado}>
              {criar.isPending ? 'A lançar...' : 'Lançar'}
            </Button>
          </PermissionGuard>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="data" className="text-sm text-text-secondary">
            Data
          </label>
          <Controller
            control={control}
            name="data"
            render={({ field }) => <Input id="data" type="date" {...field} />}
          />
          {errors.data && <p className="text-sm text-danger">{errors.data.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="periodo" className="text-sm text-text-secondary">
            Período
          </label>
          <Controller
            control={control}
            name="periodoId"
            render={({ field }) => (
              <PeriodoPicker id="periodo" value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.periodoId && <p className="text-sm text-danger">{errors.periodoId.message}</p>}
        </div>

        <div className="col-span-3 space-y-1">
          <label htmlFor="descricao" className="text-sm text-text-secondary">
            Descrição
          </label>
          <Controller
            control={control}
            name="descricao"
            render={({ field }) => <Input id="descricao" {...field} />}
          />
          {errors.descricao && <p className="text-sm text-danger">{errors.descricao.message}</p>}
        </div>
      </div>

      <LinhasLancamentoEditor control={control} />
      {errors.linhas?.message && <p className="text-sm text-danger">{errors.linhas.message}</p>}

      <SaldoLancamento saldo={saldo} />

      {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}
    </form>
  )
}
