import { Component, type ErrorInfo, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Sem isto, um erro de render em qualquer sítio da árvore desmonta a
 * aplicação inteira em silêncio (ecrã em branco, sem pista nenhuma no
 * ecrã do que aconteceu) — foi exactamente isso que escondeu o bug do
 * FormField sem <Form>/FormProvider na LoginPage.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-page p-6 text-center">
          <h1 className="text-lg font-semibold text-text-primary">Ocorreu um erro inesperado</h1>
          <p className="max-w-md text-sm text-text-muted">{this.state.error.message}</p>
          <Button type="button" onClick={() => window.location.reload()}>
            Recarregar a página
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
