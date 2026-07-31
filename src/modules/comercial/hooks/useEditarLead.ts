import { useMutation, useQueryClient } from '@tanstack/react-query'

import { editarLead } from '@/api/modules/comercial'

import type { LeadFormValues } from '../schemas/leadSchema'

export function useEditarLead(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: LeadFormValues) => editarLead(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comercial', 'leads'], exact: false })
    },
  })
}
