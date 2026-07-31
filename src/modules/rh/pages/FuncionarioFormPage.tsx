import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { DeactivateFuncionarioDialog } from '../components/DeactivateFuncionarioDialog'
import { EstadoFuncionarioBadge } from '../components/EstadoFuncionarioBadge'
import { useCriarFuncionario } from '../hooks/useCriarFuncionario'
import { useEditarFuncionario } from '../hooks/useEditarFuncionario'
import { useFuncionario } from '../hooks/useFuncionario'
import { funcionarioSchema, type FuncionarioFormValues } from '../schemas/funcionarioSchema'

function valorOuNull(value: string): string | null {
  return value === '' ? null : value
}

export default function FuncionarioFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdicao = Boolean(id)

  const { data: funcionario, isLoading } = useFuncionario(id)
  const criar = useCriarFuncionario()
  const editar = useEditarFuncionario(id ?? '')
  const [desactivarOpen, setDesactivarOpen] = useState(false)

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FuncionarioFormValues>({
    resolver: zodResolver(funcionarioSchema),
    defaultValues: {
      nome: '',
      nif: null,
      numeroSegurancaSocial: null,
      cargo: '',
      departamento: null,
      dataAdmissao: '',
      salarioBase: 0,
      subsidioAlimentacao: null,
      subsidioTransporte: null,
    },
  })

  useEffect(() => {
    if (funcionario) {
      reset({
        nome: funcionario.nome,
        nif: funcionario.nif,
        numeroSegurancaSocial: funcionario.numeroSegurancaSocial,
        cargo: funcionario.cargo,
        departamento: funcionario.departamento,
        dataAdmissao: funcionario.dataAdmissao,
        salarioBase: funcionario.salarioBase,
        subsidioAlimentacao: funcionario.subsidioAlimentacao,
        subsidioTransporte: funcionario.subsidioTransporte,
      })
    }
  }, [funcionario, reset])

  if (isEdicao && isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full max-w-xl" />
      </div>
    )
  }

  function onSubmit(values: FuncionarioFormValues) {
    if (isEdicao) {
      editar.mutate(values, {
        onSuccess: () => navigate('/rh/funcionarios'),
        onError: (error) => applyApiErrorsToForm(error, setError),
      })
    } else {
      criar.mutate(values, {
        onSuccess: () => navigate('/rh/funcionarios'),
        onError: (error) => applyApiErrorsToForm(error, setError),
      })
    }
  }

  const aGuardar = criar.isPending || editar.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <PageHeader
        title={isEdicao ? 'Editar funcionário' : 'Novo funcionário'}
        breadcrumbs={[
          { label: 'RH', href: '/rh' },
          { label: 'Funcionários', href: '/rh/funcionarios' },
          { label: isEdicao ? 'Editar' : 'Novo' },
        ]}
        actions={
          <div className="flex gap-2">
            {isEdicao && funcionario?.estado === 'activo' && (
              <Button type="button" variant="destructive" onClick={() => setDesactivarOpen(true)}>
                Desactivar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || aGuardar}>
              {aGuardar ? 'A guardar...' : 'Guardar'}
            </Button>
          </div>
        }
      />

      {isEdicao && funcionario && (
        <div>
          <EstadoFuncionarioBadge estado={funcionario.estado} />
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="cargo" className="text-sm text-text-secondary">
            Cargo
          </label>
          <Controller
            control={control}
            name="cargo"
            render={({ field }) => <Input id="cargo" aria-invalid={!!errors.cargo} {...field} />}
          />
          {errors.cargo && <p className="text-sm text-danger">{errors.cargo.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="departamento" className="text-sm text-text-secondary">
            Departamento (opcional)
          </label>
          <Controller
            control={control}
            name="departamento"
            render={({ field }) => (
              <Input
                id="departamento"
                value={field.value ?? ''}
                onChange={(event) => field.onChange(valorOuNull(event.target.value))}
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="nif" className="text-sm text-text-secondary">
            NIF (opcional)
          </label>
          <Controller
            control={control}
            name="nif"
            render={({ field }) => (
              <Input
                id="nif"
                value={field.value ?? ''}
                onChange={(event) => field.onChange(valorOuNull(event.target.value))}
              />
            )}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="numeroSegurancaSocial" className="text-sm text-text-secondary">
            Nº segurança social (opcional)
          </label>
          <Controller
            control={control}
            name="numeroSegurancaSocial"
            render={({ field }) => (
              <Input
                id="numeroSegurancaSocial"
                value={field.value ?? ''}
                onChange={(event) => field.onChange(valorOuNull(event.target.value))}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="dataAdmissao" className="text-sm text-text-secondary">
          Data de admissão
        </label>
        <Controller
          control={control}
          name="dataAdmissao"
          render={({ field }) => (
            <Input
              id="dataAdmissao"
              type="date"
              disabled={isEdicao}
              aria-invalid={!!errors.dataAdmissao}
              {...field}
            />
          )}
        />
        {errors.dataAdmissao && (
          <p className="text-sm text-danger">{errors.dataAdmissao.message}</p>
        )}
        {isEdicao && (
          <p className="text-sm text-text-muted">
            A data de admissão não pode ser alterada depois de criada.
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="salarioBase" className="text-sm text-text-secondary">
            Salário base
          </label>
          <Controller
            control={control}
            name="salarioBase"
            render={({ field }) => (
              <Input
                id="salarioBase"
                type="number"
                min={0}
                step="0.01"
                aria-invalid={!!errors.salarioBase}
                value={field.value}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            )}
          />
          {errors.salarioBase && (
            <p className="text-sm text-danger">{errors.salarioBase.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="subsidioAlimentacao" className="text-sm text-text-secondary">
            Subsídio de alimentação (opcional)
          </label>
          <Controller
            control={control}
            name="subsidioAlimentacao"
            render={({ field }) => (
              <Input
                id="subsidioAlimentacao"
                type="number"
                min={0}
                step="0.01"
                value={field.value ?? ''}
                onChange={(event) =>
                  field.onChange(event.target.value === '' ? null : Number(event.target.value))
                }
              />
            )}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="subsidioTransporte" className="text-sm text-text-secondary">
            Subsídio de transporte (opcional)
          </label>
          <Controller
            control={control}
            name="subsidioTransporte"
            render={({ field }) => (
              <Input
                id="subsidioTransporte"
                type="number"
                min={0}
                step="0.01"
                value={field.value ?? ''}
                onChange={(event) =>
                  field.onChange(event.target.value === '' ? null : Number(event.target.value))
                }
              />
            )}
          />
        </div>
      </div>

      {isEdicao && id && (
        <DeactivateFuncionarioDialog
          funcionarioId={id}
          nome={funcionario?.nome ?? ''}
          open={desactivarOpen}
          onOpenChange={setDesactivarOpen}
          onDesactivado={() => {
            setDesactivarOpen(false)
            navigate('/rh/funcionarios')
          }}
        />
      )}
    </form>
  )
}
