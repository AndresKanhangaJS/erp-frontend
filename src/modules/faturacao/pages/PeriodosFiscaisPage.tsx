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

import { useCriarPeriodoFiscal } from '../hooks/useCriarPeriodoFiscal'
import { useFecharPeriodoFiscal } from '../hooks/useFecharPeriodoFiscal'
import { usePeriodosFiscais } from '../hooks/usePeriodosFiscais'
import { periodoFiscalSchema, type PeriodoFiscalFormValues } from '../schemas/periodoFiscalSchema'
import type { PeriodoFiscal } from '../types'

export default function PeriodosFiscaisPage() {
  const { data: periodos, isLoading } = usePeriodosFiscais()
  const criar = useCriarPeriodoFiscal()
  const fechar = useFecharPeriodoFiscal()
  const [periodoParaFechar, setPeriodoParaFechar] = useState<PeriodoFiscal | null>(null)

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PeriodoFiscalFormValues>({
    resolver: zodResolver(periodoFiscalSchema),
    defaultValues: { anoFiscal: new Date().getFullYear(), mes: null },
  })

  function onSubmit(values: PeriodoFiscalFormValues) {
    criar.mutate(values, {
      onSuccess: () => reset({ anoFiscal: values.anoFiscal, mes: null }),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  const columns: ColumnDef<PeriodoFiscal>[] = [
    {
      accessorKey: 'anoFiscal',
      header: 'Período',
      cell: ({ row }) =>
        row.original.mes
          ? `${String(row.original.mes).padStart(2, '0')}/${row.original.anoFiscal}`
          : `Ano ${row.original.anoFiscal}`,
    },
    {
      accessorKey: 'fechado',
      header: 'Estado',
      cell: ({ row }) => (row.original.fechado ? 'Fechado' : 'Aberto'),
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
      <PageHeader title="Períodos fiscais" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex items-end gap-4 rounded-lg border border-border bg-surface-card p-4"
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
            Mês (opcional)
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
                placeholder="Ano inteiro"
                value={field.value ?? ''}
                onChange={(event) =>
                  field.onChange(event.target.value === '' ? null : Number(event.target.value))
                }
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
        title="Fechar período fiscal"
        description={
          periodoParaFechar
            ? `Depois de fechado, este período deixa de aceitar novas facturas. Esta acção não pode ser revertida.`
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
