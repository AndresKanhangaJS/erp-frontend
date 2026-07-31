import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarLead } from '@/api/modules/comercial'

import type { LeadFormValues } from '../schemas/leadSchema'

export function useCriarLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: LeadFormValues) => criarLead(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comercial', 'leads'], exact: false })
    },
  })
}
