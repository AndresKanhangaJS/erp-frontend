import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Retry automático em falhas de rede (ligações lentas/instáveis) mas nunca
 * em erros 4xx — repetir um pedido mal formado ou sem permissão não vai
 * mudar de resultado. Mutations não repetem por omissão: reenviar um
 * POST/PATCH às cegas após falha de rede arrisca duplicar a acção.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error) && error.response && error.response.status < 500) {
          return false
        }
        return failureCount < 2
      },
    },
    mutations: {
      retry: 0,
    },
  },
})
