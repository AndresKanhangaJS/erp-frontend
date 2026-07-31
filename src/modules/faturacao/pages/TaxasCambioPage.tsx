import { zodResolver } from '@hookform/resolvers/zod'
import type { ColumnDef } from '@tanstack/react-table'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'
import { formatDate } from '@/shared/utils/formatDate'

import { useCriarTaxaCambio } from '../hooks/useCriarTaxaCambio'
import { useTaxasCambio } from '../hooks/useTaxasCambio'
import { taxaCambioSchema, type TaxaCambioFormValues } from '../schemas/taxaCambioSchema'
import type { TaxaCambio } from '../types'

const columns: ColumnDef<TaxaCambio>[] = [
  { accessorKey: 'moeda', header: 'Moeda' },
  {
    accessorKey: 'taxa',
    header: 'Taxa (para AOA)',
    cell: ({ row }) => <span className="font-mono">{row.original.taxa.toFixed(4)}</span>,
  },
  { accessorKey: 'data', header: 'Data', cell: ({ row }) => formatDate(row.original.data) },
]

export default function TaxasCambioPage() {
  const { data: taxas, isLoading } = useTaxasCambio()
  const criar = useCriarTaxaCambio()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaxaCambioFormValues>({
    resolver: zodResolver(taxaCambioSchema),
    defaultValues: { moeda: 'USD', taxa: 0, data: new Date().toISOString().slice(0, 10) },
  })

  function onSubmit(values: TaxaCambioFormValues) {
    criar.mutate(values, {
      onSuccess: () => reset({ ...values, taxa: 0 }),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Taxas de câmbio" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex items-end gap-4 rounded-xl bg-surface-card p-4 ring-1 ring-foreground/10"
      >
        <div className="space-y-1">
          <label htmlFor="moeda" className="text-sm text-text-secondary">
            Moeda
          </label>
          <Controller
            control={control}
            name="moeda"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="moeda" className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="taxa" className="text-sm text-text-secondary">
            Taxa (para AOA)
          </label>
          <Controller
            control={control}
            name="taxa"
            render={({ field }) => (
              <Input
                id="taxa"
                type="number"
                min={0}
                step="0.0001"
                className="w-32"
                aria-invalid={!!errors.taxa}
                value={field.value}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            )}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="data" className="text-sm text-text-secondary">
            Data
          </label>
          <Controller
            control={control}
            name="data"
            render={({ field }) => <Input id="data" type="date" {...field} />}
          />
        </div>
        <Button type="submit" disabled={isSubmitting || criar.isPending}>
          {criar.isPending ? 'A guardar...' : 'Guardar taxa'}
        </Button>
      </form>

      <DataTable
        columns={columns}
        data={taxas ?? []}
        isLoading={isLoading}
        emptyTitle="Sem taxas de câmbio"
      />
    </div>
  )
}
