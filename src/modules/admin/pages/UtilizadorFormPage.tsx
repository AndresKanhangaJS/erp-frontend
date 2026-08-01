import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { DesactivarUtilizadorDialog } from '../components/DesactivarUtilizadorDialog'
import { TemporaryPasswordDialog } from '../components/TemporaryPasswordDialog'
import { useCriarUtilizador } from '../hooks/useCriarUtilizador'
import { useEditarUtilizador } from '../hooks/useEditarUtilizador'
import { useResetPasswordUtilizador } from '../hooks/useResetPasswordUtilizador'
import { useUtilizador } from '../hooks/useUtilizador'
import { utilizadorSchema, type UtilizadorFormValues } from '../schemas/utilizadorSchema'
import { USER_ROLES, USER_ROLE_LABELS } from '../types'

export default function UtilizadorFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdicao = Boolean(id)

  const { data: utilizador, isLoading } = useUtilizador(id)
  const criar = useCriarUtilizador()
  const editar = useEditarUtilizador(id ?? '')
  const resetPassword = useResetPasswordUtilizador(id ?? '')
  const [desactivarOpen, setDesactivarOpen] = useState(false)
  const [senhaTemporaria, setSenhaTemporaria] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UtilizadorFormValues>({
    resolver: zodResolver(utilizadorSchema),
    defaultValues: { nome: '', email: '', role: 'readonly' },
  })

  useEffect(() => {
    if (utilizador) {
      reset({
        nome: utilizador.nome,
        email: utilizador.email,
        role: utilizador.roles[0] ?? 'readonly',
      })
    }
  }, [utilizador, reset])

  if (isEdicao && isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full max-w-xl" />
      </div>
    )
  }

  function onSubmit(values: UtilizadorFormValues) {
    if (isEdicao) {
      editar.mutate(values, {
        onSuccess: () => navigate('/admin/utilizadores'),
        onError: (error) => applyApiErrorsToForm(error, setError),
      })
    } else {
      criar.mutate(values, {
        onSuccess: (result) => setSenhaTemporaria(result.temporaryPassword),
        onError: (error) => applyApiErrorsToForm(error, setError),
      })
    }
  }

  const aGuardar = criar.isPending || editar.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <PageHeader
        title={isEdicao ? 'Editar utilizador' : 'Novo utilizador'}
        breadcrumbs={[
          { label: 'Utilizadores', href: '/admin/utilizadores' },
          { label: isEdicao ? 'Editar' : 'Novo' },
        ]}
        actions={
          <div className="flex gap-2">
            {isEdicao && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={resetPassword.isPending}
                  onClick={() =>
                    resetPassword.mutate(undefined, {
                      onSuccess: (temporaryPassword) => setSenhaTemporaria(temporaryPassword),
                    })
                  }
                >
                  {resetPassword.isPending ? 'A repor...' : 'Repor password'}
                </Button>
                <Button type="button" variant="destructive" onClick={() => setDesactivarOpen(true)}>
                  Desactivar
                </Button>
              </>
            )}
            <Button type="submit" disabled={isSubmitting || aGuardar}>
              {aGuardar ? 'A guardar...' : 'Guardar'}
            </Button>
          </div>
        }
      />

      {isEdicao && utilizador?.mustChangePassword && (
        <Badge className="bg-warning-subtle text-warning">
          Aguarda troca de password no primeiro acesso
        </Badge>
      )}

      <div className="space-y-1">
        <label htmlFor="nome" className="text-sm text-text-secondary">
          Nome
        </label>
        <Controller
          control={control}
          name="nome"
          render={({ field }) => <Input id="nome" aria-invalid={!!errors.nome} {...field} />}
        />
        {errors.nome && <p className="text-sm text-danger">{errors.nome.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm text-text-secondary">
          Email
        </label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input id="email" type="email" aria-invalid={!!errors.email} {...field} />
          )}
        />
        {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="role" className="text-sm text-text-secondary">
          Role
        </label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {USER_ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && <p className="text-sm text-danger">{errors.role.message}</p>}
      </div>

      {!isEdicao && (
        <p className="text-sm text-text-muted">
          Uma senha temporária é gerada automaticamente — vais poder copiá-la depois de criares o
          utilizador.
        </p>
      )}

      {senhaTemporaria && (
        <TemporaryPasswordDialog
          open
          password={senhaTemporaria}
          onOpenChange={(open) => {
            if (!open) {
              setSenhaTemporaria(null)
              if (!isEdicao) {
                navigate('/admin/utilizadores')
              }
            }
          }}
        />
      )}

      {isEdicao && id && (
        <DesactivarUtilizadorDialog
          utilizadorId={id}
          nome={utilizador?.nome ?? ''}
          open={desactivarOpen}
          onOpenChange={setDesactivarOpen}
          onDesactivado={() => {
            setDesactivarOpen(false)
            navigate('/admin/utilizadores')
          }}
        />
      )}
    </form>
  )
}
