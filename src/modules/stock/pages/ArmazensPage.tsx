import { zodResolver } from '@hookform/resolvers/zod'
import type { ColumnDef } from '@tanstack/react-table'
import { Warehouse } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { StatCard } from '@/shared/components/ui/StatCard'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { useArmazens } from '../hooks/useArmazens'
import { useCriarArmazem } from '../hooks/useCriarArmazem'
import { armazemSchema, type ArmazemFormValues } from '../schemas/armazemSchema'
import type { Armazem } from '../types'

const columns: ColumnDef<Armazem>[] = [
  {
    accessorKey: 'codigo',
    header: 'Código',
    cell: ({ row }) => <span className="font-mono">{row.original.codigo}</span>,
  },
  { accessorKey: 'nome', header: 'Nome' },
  { accessorKey: 'endereco', header: 'Endereço', cell: ({ row }) => row.original.endereco ?? '—' },
  {
    accessorKey: 'isPadrao',
    header: 'Padrão',
    cell: ({ row }) => (row.original.isPadrao ? 'Sim' : 'Não'),
  },
]

export default function ArmazensPage() {
  const { data: armazens, isLoading } = useArmazens()
  const criar = useCriarArmazem()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArmazemFormValues>({
    resolver: zodResolver(armazemSchema),
    defaultValues: { codigo: '', nome: '', endereco: null },
  })

  function onSubmit(values: ArmazemFormValues) {
    criar.mutate(values, {
      onSuccess: () => reset({ codigo: '', nome: '', endereco: null }),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Armazéns" />

      {armazens && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total de armazéns"
            value={armazens.length}
            icon={Warehouse}
            tone="accent"
          />
        </div>
      )}

      <PermissionGuard permission="stock.movimentar">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex items-end gap-4 rounded-xl bg-surface-card p-4 ring-1 ring-foreground/10"
        >
          <div className="space-y-1">
            <label htmlFor="codigo" className="text-sm text-text-secondary">
              Código
            </label>
            <Controller
              control={control}
              name="codigo"
              render={({ field }) => (
                <Input id="codigo" className="w-28" aria-invalid={!!errors.codigo} {...field} />
              )}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="nome" className="text-sm text-text-secondary">
              Nome
            </label>
            <Controller
              control={control}
              name="nome"
              render={({ field }) => <Input id="nome" aria-invalid={!!errors.nome} {...field} />}
            />
          </div>
          <div className="flex-1 space-y-1">
            <label htmlFor="endereco" className="text-sm text-text-secondary">
              Endereço (opcional)
            </label>
            <Controller
              control={control}
              name="endereco"
              render={({ field }) => (
                <Input
                  id="endereco"
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(event.target.value || null)}
                />
              )}
            />
          </div>
          <Button type="submit" disabled={isSubmitting || criar.isPending}>
            {criar.isPending ? 'A criar...' : 'Criar armazém'}
          </Button>
        </form>
      </PermissionGuard>

      <DataTable
        columns={columns}
        data={armazens ?? []}
        isLoading={isLoading}
        emptyTitle="Sem armazéns"
      />
    </div>
  )
}
