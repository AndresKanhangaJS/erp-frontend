import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'

import { queryClient } from '@/api/queryClient'

interface ProvidersProps {
  children: ReactNode
}

/**
 * O Toaster tem de estar montado para os toast.error(...) do
 * interceptor do axios (src/api/client.ts) apareceram — até aqui
 * eram chamadas sem efeito visível, sem nenhum <Toaster/> na árvore.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
