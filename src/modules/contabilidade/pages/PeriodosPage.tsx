import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ColumnDef } from '@tanstack/react-table'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { DataTable } from '@/shared/components/ui/DataTable'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { EstadoPeriodoBadge } from '../components/EstadoPeriodoBadge'
import { useCriarPeriodo, useFecharPeriodo, usePeriodos } from '../hooks/usePeriodos'
import { periodoSchema, type PeriodoFormValues } from '../schemas/periodoSchema'
import type { Periodo } from '../types'

export default function PeriodosPage() {
  const { data: periodos, isLoading } = usePeriodos()
  const criar = useCriarPeriodo()
  const fechar = useFecharPeriodo()
  const [periodoParaFechar, setPeriodoParaFechar] = useState<Periodo | null>(null)

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PeriodoFormValues>({
    resolver: zodResolver(periodoSchema),
    defaultValues: { anoFiscal: new Date().getFullYear(), mes: new Date().getMonth() + 1 },
  })

  function onSubmit(values: PeriodoFormValues) {
    criar.mutate(values, {
      onSuccess: () => reset({ ...values }),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  const columns: ColumnDef<Periodo>[] = [
    {
      accessorKey: 'mes',
      header: 'Período',
      cell: ({ row }) => `${String(row.original.mes).padStart(2, '0')}/${row.original.anoFiscal}`,
    },
    {
      accessorKey: 'fechado',
      header: 'Estado',
      cell: ({ row }) => <EstadoPeriodoBadge fechado={row.original.fechado} />,
    },
    {
      id: 'acoes',
      header: '',
      cell: ({ row }) =>
        !row.original.fechado ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPeriodoParaFechar(row.original)}
          >
            Fechar período
          </Button>
        ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Períodos" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex items-end gap-4 rounded-xl bg-surface-card p-4 ring-1 ring-foreground/10"
      >
        <div className="space-y-1">
          <label htmlFor="anoFiscal" className="text-sm text-text-secondary">
            Ano fiscal
          </label>
          <Controller
            control={control}
            name="anoFiscal"
            render={({ field }) => (
              <Input
                id="anoFiscal"
                type="number"
                className="w-28"
                aria-invalid={!!errors.anoFiscal}
                value={field.value}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            )}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="mes" className="text-sm text-text-secondary">
            Mês
          </label>
          <Controller
            control={control}
            name="mes"
            render={({ field }) => (
              <Input
                id="mes"
                type="number"
                min={1}
                max={12}
                className="w-24"
                aria-invalid={!!errors.mes}
                value={field.value}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting || criar.isPending}>
          {criar.isPending ? 'A criar...' : 'Criar período'}
        </Button>
      </form>

      <DataTable
        columns={columns}
        data={periodos ?? []}
        isLoading={isLoading}
        emptyTitle="Sem períodos"
      />

      <ConfirmDialog
        open={periodoParaFechar !== null}
        onOpenChange={(open) => !open && setPeriodoParaFechar(null)}
        title="Fechar período"
        description={
          periodoParaFechar
            ? `Depois de fechado, ${String(periodoParaFechar.mes).padStart(2, '0')}/${periodoParaFechar.anoFiscal} deixa de aceitar novos lançamentos. Esta acção não pode ser revertida.`
            : ''
        }
        destructive
        loading={fechar.isPending}
        onConfirm={() => {
          if (periodoParaFechar) {
            fechar.mutate(periodoParaFechar.id, { onSuccess: () => setPeriodoParaFechar(null) })
          }
        }}
      />
    </div>
  )
}
