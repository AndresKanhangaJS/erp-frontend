import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { applyApiErrorsToForm, getApiErrorMessage } from '@/shared/utils/mapApiErrors'

import { useActualizarAgtConfiguracao } from '../hooks/useActualizarAgtConfiguracao'
import { useAgtConfiguracao } from '../hooks/useAgtConfiguracao'
import {
  agtConfiguracaoSchema,
  type AgtConfiguracaoFormValues,
} from '../schemas/agtConfiguracaoSchema'

export default function AgtConfiguracaoPage() {
  const { data: configuracao, isLoading } = useAgtConfiguracao()
  const actualizar = useActualizarAgtConfiguracao()

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AgtConfiguracaoFormValues>({
    resolver: zodResolver(agtConfiguracaoSchema),
    defaultValues: {
      nifEmitente: '',
      establishmentNumber: '',
      eacCode: '',
      codigoIsencaoPadrao: '',
      ambiente: 'hml',
      activa: false,
      username: '',
      password: '',
      chavePrivadaPem: '',
      certificadoPem: '',
    },
  })

  useEffect(() => {
    if (configuracao) {
      reset({
        nifEmitente: configuracao.nifEmitente ?? '',
        establishmentNumber: configuracao.establishmentNumber ?? '',
        eacCode: configuracao.eacCode ?? '',
        codigoIsencaoPadrao: configuracao.codigoIsencaoPadrao ?? '',
        ambiente: configuracao.ambiente,
        activa: configuracao.activa,
        username: '',
        password: '',
        chavePrivadaPem: '',
        certificadoPem: '',
      })
    }
  }, [configuracao, reset])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full max-w-xl" />
      </div>
    )
  }

  function onSubmit(values: AgtConfiguracaoFormValues) {
    actualizar.mutate(values, {
      onError: (error) => {
        if (!applyApiErrorsToForm(error, setError)) {
          setError('root', {
            message: getApiErrorMessage(error, 'Não foi possível guardar a configuração.'),
          })
        }
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <PageHeader
        title="Configuração AGT"
        actions={
          <Button type="submit" disabled={isSubmitting || actualizar.isPending}>
            {actualizar.isPending ? 'A guardar...' : 'Guardar'}
          </Button>
        }
      />

      {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}

      {configuracao && (
        <Badge
          className={
            configuracao.temCredenciais
              ? 'bg-success-subtle text-success'
              : 'bg-warning-subtle text-warning'
          }
        >
          {configuracao.temCredenciais
            ? 'Credenciais configuradas'
            : 'Sem credenciais configuradas'}
        </Badge>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="nifEmitente" className="text-sm text-text-secondary">
            NIF emitente
          </label>
          <Controller
            control={control}
            name="nifEmitente"
            render={({ field }) => (
              <Input id="nifEmitente" aria-invalid={!!errors.nifEmitente} {...field} />
            )}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="establishmentNumber" className="text-sm text-text-secondary">
            Establishment number
          </label>
          <Controller
            control={control}
            name="establishmentNumber"
            render={({ field }) => <Input id="establishmentNumber" {...field} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="eacCode" className="text-sm text-text-secondary">
            EAC code (opcional)
          </label>
          <Controller
            control={control}
            name="eacCode"
            render={({ field }) => <Input id="eacCode" {...field} />}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="codigoIsencaoPadrao" className="text-sm text-text-secondary">
            Código de isenção por omissão (opcional)
          </label>
          <Controller
            control={control}
            name="codigoIsencaoPadrao"
            render={({ field }) => <Input id="codigoIsencaoPadrao" {...field} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="ambiente" className="text-sm text-text-secondary">
            Ambiente
          </label>
          <Controller
            control={control}
            name="ambiente"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="ambiente" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hml">Homologação</SelectItem>
                  <SelectItem value="prd">Produção</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <p className="text-sm font-medium text-text-primary">Integração activa</p>
            <p className="text-xs text-text-muted">Submete facturas à AGT ao emitir.</p>
          </div>
          <Controller
            control={control}
            name="activa"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Integração AGT activa"
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Credenciais</h2>
          <p className="text-sm text-text-muted">
            Nunca são mostradas depois de guardadas — deixa em branco para manter as actuais.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="username" className="text-sm text-text-secondary">
              Utilizador
            </label>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <Input id="username" autoComplete="off" placeholder="Sem alteração" {...field} />
              )}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-text-secondary">
              Password
            </label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Sem alteração"
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="chavePrivadaPem" className="text-sm text-text-secondary">
            Chave privada (PEM)
          </label>
          <Controller
            control={control}
            name="chavePrivadaPem"
            render={({ field }) => (
              <Textarea
                id="chavePrivadaPem"
                className="min-h-24 font-mono text-xs"
                placeholder="Sem alteração"
                {...field}
              />
            )}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="certificadoPem" className="text-sm text-text-secondary">
            Certificado (PEM, opcional)
          </label>
          <Controller
            control={control}
            name="certificadoPem"
            render={({ field }) => (
              <Textarea
                id="certificadoPem"
                className="min-h-24 font-mono text-xs"
                placeholder="Sem alteração"
                {...field}
              />
            )}
          />
        </div>
      </div>
    </form>
  )
}
