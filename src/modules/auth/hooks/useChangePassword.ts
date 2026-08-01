import { useMutation } from '@tanstack/react-query'

import { changePassword } from '@/api/modules/auth'

import type { ChangePasswordFormValues } from '../schemas/changePasswordSchema'

export function useChangePassword() {
  return useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      changePassword({
        currentPassword: values.currentPassword,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      }),
  })
}
