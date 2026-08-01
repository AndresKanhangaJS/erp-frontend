import { useMutation } from '@tanstack/react-query'

import { resetPasswordUtilizador } from '@/api/modules/admin'

export function useResetPasswordUtilizador(id: string) {
  return useMutation({
    mutationFn: () => resetPasswordUtilizador(id),
  })
}
