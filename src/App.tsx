import { useEffect, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { AppShell } from '@/shared/components/layout/AppShell'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { CurrencyInput } from '@/shared/components/ui/CurrencyInput'
import { DataTable } from '@/shared/components/ui/DataTable'
import { DatePicker } from '@/shared/components/ui/DatePicker'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { useAuthStore } from '@/shared/stores/authStore'
import { useTenantStore } from '@/shared/stores/tenantStore'

interface DocumentoDemo {
  numero: string
  cliente: string
  total: number
}

const DOCUMENTOS: DocumentoDemo[] = [
  { numero: 'FT 2026/000123', cliente: 'Angola Digital, Lda', total: 125000 },
  { numero: 'FT 2026/000124', cliente: 'Kwanza Tech', total: 48250.5 },
]

const columns: ColumnDef<DocumentoDemo>[] = [
  { accessorKey: 'numero', header: 'Nº Documento' },
  { accessorKey: 'cliente', header: 'Cliente' },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => <CurrencyDisplay value={row.original.total} className="block text-right" />,
  },
]

/**
 * Página de smoke-test do Passo 7 (design system + componentes
 * partilhados). Substituída pelo router real no Passo 8 — o
 * seed de auth/tenant abaixo é só para a Sidebar/Topbar terem algo
 * para mostrar antes de existir login de verdade.
 */
function App() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [valor, setValor] = useState<number | null>(125000)
  const [data, setData] = useState<Date | null>(new Date())

  useEffect(() => {
    useAuthStore.getState().setAuth({
      token: 'demo-token',
      user: { id: '1', name: 'Ana Contabilista', email: 'ana@example.com' },
      permissions: ['faturacao.emitir'],
    })
    useTenantStore.getState().setTenant({
      tenantId: 'demo-tenant',
      plan: 'starter',
      activeModules: ['faturacao'],
    })
  }, [])

  return (
    <AppShell>
      <PageHeader
        title="Documentos"
        breadcrumbs={[{ label: 'Facturação', href: '/faturacao' }, { label: 'Documentos' }]}
        actions={
          <PermissionGuard permission="faturacao.emitir">
            <Button type="button" onClick={() => setConfirmOpen(true)}>
              Anular factura
            </Button>
          </PermissionGuard>
        }
      />

      <div className="mt-6 flex gap-4">
        <div className="w-56 space-y-1">
          <label htmlFor="valor" className="text-sm text-text-secondary">
            Valor
          </label>
          <CurrencyInput id="valor" value={valor} onChange={setValor} />
        </div>
        <div className="w-56 space-y-1">
          <label htmlFor="data" className="text-sm text-text-secondary">
            Data
          </label>
          <DatePicker value={data} onChange={setData} />
        </div>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} data={DOCUMENTOS} />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Anular factura"
        description="Esta acção não pode ser revertida."
        destructive
        onConfirm={() => setConfirmOpen(false)}
      />
    </AppShell>
  )
}

export default App
