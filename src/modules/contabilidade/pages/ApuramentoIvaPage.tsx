import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'
import { formatDate } from '@/shared/utils/formatDate'

import { PeriodoPicker } from '../components/PeriodoPicker'
import { useApurarIva } from '../hooks/useApurarIva'
import { apurarIvaSchema, type ApurarIvaFormValues } from '../schemas/apuramentoIvaSchema'
import type { ApuramentoIva } from '../types'

/** Não há endpoint de listagem de apuramentos — só se vê o resultado imediatamente após apurar. */
export default function ApuramentoIvaPage() {
  const apurar = useApurarIva()
  const [resultado, setResultado] = useState<ApuramentoIva | null>(null)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApurarIvaFormValues>({
    resolver: zodResolver(apurarIvaSchema),
    defaultValues: { periodoId: '' },
  })

  function onSubmit(values: ApurarIvaFormValues) {
    apurar.mutate(values, {
      onSuccess: (apuramento) => setResultado(apuramento),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Apuramento de IVA" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex items-end gap-4 rounded-lg border border-border bg-surface-card p-4"
      >
        <div className="max-w-xs flex-1 space-y-1">
          <label htmlFor="periodoId" className="text-sm text-text-secondary">
            Período
          </label>
          <Controller
            control={control}
            name="periodoId"
            render={({ field }) => (
              <PeriodoPicker
                id="periodoId"
                value={field.value}
                onChange={field.onChange}
                apenasAbertos={false}
              />
            )}
          />
          {errors.periodoId && <p className="text-sm text-danger">{errors.periodoId.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting || apurar.isPending}>
          {apurar.isPending ? 'A apurar...' : 'Apurar IVA'}
        </Button>
      </form>

      {resultado && (
        <div className="max-w-md space-y-1.5 rounded-lg border border-border bg-surface-card p-4">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>IVA liquidado</span>
            <CurrencyDisplay value={resultado.ivaLiquidado} />
          </div>
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>IVA dedutível</span>
            <CurrencyDisplay value={resultado.ivaDedutivel} />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-1.5 text-base font-semibold text-text-primary">
            <span>IVA apurado</span>
            <CurrencyDisplay value={resultado.ivaApurado} />
          </div>
          {resultado.dataApuramento && (
            <p className="pt-1 text-xs text-text-muted">
              Apurado em {formatDate(resultado.dataApuramento)}
            </p>
          )}
          {resultado.lancamentoId && (
            <p className="text-xs text-text-muted">
              <Link
                to={`/contabilidade/lancamentos/${resultado.lancamentoId}`}
                className="underline"
              >
                Ver lançamento gerado
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
