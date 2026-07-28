import { useState } from 'react'

/**
 * Página de smoke-test do design system (Passo 4).
 * Substituída pelo router real no Passo 8.
 */
function App() {
  const [dark, setDark] = useState(false)

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen space-y-6 bg-surface-page p-8 text-text-primary">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Design system — smoke test</h1>
          <button
            type="button"
            onClick={() => setDark((v) => !v)}
            className="rounded-md border border-border-strong bg-surface-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            Alternar tema ({dark ? 'escuro' : 'claro'})
          </button>
        </div>

        <section className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-surface-card p-4">
            <p className="text-sm text-text-secondary">surface-card</p>
            <p className="text-text-muted">text-muted</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-raised p-4">
            <p className="text-sm text-text-secondary">surface-raised</p>
          </div>
          <div className="rounded-lg border-2 border-border-focus bg-surface-card p-4">
            <p className="text-sm text-text-secondary">border-focus</p>
          </div>
        </section>

        <section className="flex flex-wrap gap-3">
          <span className="rounded-md bg-success-subtle px-2.5 py-1 text-sm text-success">
            Pago
          </span>
          <span className="rounded-md bg-warning-subtle px-2.5 py-1 text-sm text-warning">
            Pendente
          </span>
          <span className="rounded-md bg-danger-subtle px-2.5 py-1 text-sm text-danger">
            Anulado
          </span>
          <span className="rounded-md bg-info-subtle px-2.5 py-1 text-sm text-info">Rascunho</span>
          <span className="rounded-md bg-surface-raised px-2.5 py-1 text-sm text-agt">
            Certificado AGT
          </span>
        </section>

        <section className="flex items-center gap-4">
          <button type="button" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
            Emitir factura
          </button>
          <p className="font-mono text-lg tabular-nums">125.000,00 AOA</p>
          <p className="font-mono text-sm text-text-muted">FT 2026/000123</p>
        </section>
      </div>
    </div>
  )
}

export default App
