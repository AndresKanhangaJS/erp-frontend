import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowLeftRight } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'

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
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { DataTable } from '@/shared/components/ui/DataTable'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { StatCard } from '@/shared/components/ui/StatCard'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'
import { formatDate } from '@/shared/utils/formatDate'

import { ArmazemPicker } from '../components/ArmazemPicker'
import { ArtigoStockCombobox, type ArtigoSelecionado } from '../components/ArtigoStockCombobox'
import { useMovimentos } from '../hooks/useMovimentos'
import { useRegistarMovimento } from '../hooks/useRegistarMovimento'
import { movimentoSchema, type MovimentoFormValues } from '../schemas/movimentoSchema'
import type { MovimentoStock } from '../types'

const PER_PAGE = 20

const TIPO_LABELS: Record<string, string> = {
  entrada: 'Entrada',
  saida: 'Saída',
  ajuste: 'Ajuste',
  transferencia: 'Transferência',
}

const columns: ColumnDef<MovimentoStock>[] = [
  {
    id: 'artigo',
    header: 'Artigo',
    cell: ({ row }) => (
      <Link to={`/stock/movimentos/${row.original.id}`} className="hover:underline">
        <span className="font-mono text-xs text-text-muted">{row.original.artigoCodigo}</span>{' '}
        {row.original.artigoNome}
      </Link>
    ),
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => TIPO_LABELS[row.original.tipo] ?? row.original.tipo,
  },
  {
    accessorKey: 'quantidade',
    header: 'Quantidade',
    cell: ({ row }) => (
      <span className="block text-right font-mono">{row.original.quantidade}</span>
    ),
  },
  {
    accessorKey: 'custoUnitario',
    header: 'Custo unitário',
    cell: ({ row }) => (
      <CurrencyDisplay value={row.original.custoUnitario} className="block text-right" />
    ),
  },
  {
    accessorKey: 'data',
    header: 'Data',
    cell: ({ row }) => (row.original.data ? formatDate(row.original.data) : '—'),
  },
]

export default function MovimentosPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useMovimentos({ page: page + 1, perPage: PER_PAGE })
  const registar = useRegistarMovimento()
  const [artigo, setArtigo] = useState<ArtigoSelecionado | null>(null)

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MovimentoFormValues>({
    resolver: zodResolver(movimentoSchema),
    defaultValues: {
      armazemId: '',
      artigoId: '',
      tipo: 'entrada',
      quantidade: 0,
      custoUnitario: null,
      observacoes: null,
    },
  })

  function onSubmit(values: MovimentoFormValues) {
    registar.mutate(values, {
      onSuccess: () => {
        setArtigo(null)
        reset({
          armazemId: values.armazemId,
          artigoId: '',
          tipo: 'entrada',
          quantidade: 0,
          custoUnitario: null,
          observacoes: null,
        })
      },
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Movimentos de stock"
        actions={
          <PermissionGuard permission="stock.movimentar">
            <Button asChild variant="outline">
              <Link to="/stock/movimentos/transferir">Transferir entre armazéns</Link>
            </Button>
          </PermissionGuard>
        }
      />

      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total de movimentos"
            value={data.meta.total}
            icon={ArrowLeftRight}
            tone="accent"
          />
        </div>
      )}

      <PermissionGuard permission="stock.movimentar">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid grid-cols-2 gap-4 rounded-xl bg-surface-card p-4 ring-1 ring-foreground/10 md:grid-cols-4"
        >
          <div className="space-y-1">
            <label htmlFor="armazemId" className="text-sm text-text-secondary">
              Armazém
            </label>
            <Controller
              control={control}
              name="armazemId"
              render={({ field }) => (
                <ArmazemPicker id="armazemId" value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.armazemId && <p className="text-sm text-danger">{errors.armazemId.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="artigoId" className="text-sm text-text-secondary">
              Artigo
            </label>
            <Controller
              control={control}
              name="artigoId"
              render={() => (
                <ArtigoStockCombobox
                  id="artigoId"
                  value={artigo}
                  onChange={(next) => {
                    setArtigo(next)
                    setValue('artigoId', next?.id ?? '', { shouldValidate: true })
                  }}
                />
              )}
            />
            {errors.artigoId && <p className="text-sm text-danger">{errors.artigoId.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="tipo" className="text-sm text-text-secondary">
              Tipo
            </label>
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="tipo" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="quantidade" className="text-sm text-text-secondary">
              Quantidade
            </label>
            <Controller
              control={control}
              name="quantidade"
              render={({ field }) => (
                <Input
                  id="quantidade"
                  type="number"
                  min={0}
                  step="0.01"
                  aria-invalid={!!errors.quantidade}
                  value={field.value}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                />
              )}
            />
            {errors.quantidade && (
              <p className="text-sm text-danger">{errors.quantidade.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="custoUnitario" className="text-sm text-text-secondary">
              Custo unitário (opcional)
            </label>
            <Controller
              control={control}
              name="custoUnitario"
              render={({ field }) => (
                <Input
                  id="custoUnitario"
                  type="number"
                  min={0}
                  step="0.01"
                  value={field.value ?? ''}
                  onChange={(event) =>
                    field.onChange(event.target.value === '' ? null : Number(event.target.value))
                  }
                />
              )}
            />
          </div>

          <div className="col-span-2 space-y-1">
            <label htmlFor="observacoes" className="text-sm text-text-secondary">
              Observações (opcional)
            </label>
            <Controller
              control={control}
              name="observacoes"
              render={({ field }) => (
                <Input
                  id="observacoes"
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(event.target.value || null)}
                />
              )}
            />
          </div>

          <div className="col-span-full">
            <Button type="submit" disabled={isSubmitting || registar.isPending}>
              {registar.isPending ? 'A registar...' : 'Registar movimento'}
            </Button>
          </div>
        </form>
      </PermissionGuard>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem movimentos"
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
