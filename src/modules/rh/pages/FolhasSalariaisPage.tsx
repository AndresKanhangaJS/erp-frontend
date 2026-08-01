import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ColumnDef } from '@tanstack/react-table'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { EstadoFolhaBadge } from '../components/EstadoFolhaBadge'
import { useFolhas } from '../hooks/useFolhas'
import { useProcessarFolha } from '../hooks/useProcessarFolha'
import {
  processarFolhaSchema,
  type ProcessarFolhaFormValues,
} from '../schemas/processarFolhaSchema'
import type { FolhaSalarial } from '../types'

const PER_PAGE = 20

const columns: ColumnDef<FolhaSalarial>[] = [
  {
    accessorKey: 'mes',
    header: 'Período',
    cell: ({ row }) => (
      <Link to={`/rh/folhas-salariais/${row.original.id}`} className="font-mono hover:underline">
        {String(row.original.mes).padStart(2, '0')}/{row.original.anoFiscal}
      </Link>
    ),
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => <EstadoFolhaBadge estado={row.original.estado} />,
  },
]

export default function FolhasSalariaisPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useFolhas({ page: page + 1, perPage: PER_PAGE })
  const processar = useProcessarFolha()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProcessarFolhaFormValues>({
    resolver: zodResolver(processarFolhaSchema),
    defaultValues: { anoFiscal: new Date().getFullYear(), mes: new Date().getMonth() + 1 },
  })

  function onSubmit(values: ProcessarFolhaFormValues) {
    processar.mutate(values, {
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Folhas salariais" />

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
        <PermissionGuard permission="rh.processar_vencimentos">
          <Button type="submit" disabled={isSubmitting || processar.isPending}>
            {processar.isPending ? 'A processar...' : 'Processar folha'}
          </Button>
        </PermissionGuard>
      </form>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem folhas salariais"
        emptyDescription="Processa a primeira folha para a veres aqui."
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
