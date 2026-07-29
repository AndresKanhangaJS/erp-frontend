import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { ContaCombobox } from '../components/ContaCombobox'
import { useContasArvore } from '../hooks/useContasArvore'
import { useCriarConta } from '../hooks/useCriarConta'
import { useEditarConta } from '../hooks/useEditarConta'
import { contaSchema, type ContaFormValues } from '../schemas/contaSchema'
import type { Conta } from '../types'

type ContaSelecionada = Pick<Conta, 'id' | 'codigo' | 'designacao'>

const TIPO_OPCOES: { value: Conta['tipo']; label: string }[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'passivo', label: 'Passivo' },
  { value: 'capital_proprio', label: 'Capital Próprio' },
  { value: 'proveito', label: 'Proveito' },
  { value: 'custo', label: 'Custo' },
]

export default function ContaFormPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isEdicao = Boolean(id)

  const { data: contas, isLoading } = useContasArvore()
  const conta = isEdicao ? contas?.find((c) => c.id === id) : undefined
  const contaPaiInicial = conta?.contaPaiId
    ? contas?.find((c) => c.id === conta.contaPaiId)
    : undefined

  const criar = useCriarConta()
  const editar = useEditarConta(id ?? '')

  const [contaPai, setContaPai] = useState<ContaSelecionada | null>(null)

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContaFormValues>({
    resolver: zodResolver(contaSchema),
    defaultValues: {
      codigo: '',
      designacao: '',
      tipo: 'activo',
      contaPaiId: searchParams.get('contaPaiId'),
      permiteLancamentos: true,
    },
  })

  useEffect(() => {
    if (conta) {
      reset({
        codigo: conta.codigo,
        designacao: conta.designacao,
        tipo: conta.tipo,
        contaPaiId: conta.contaPaiId,
        permiteLancamentos: conta.permiteLancamentos,
      })
    }
  }, [conta, reset])

  useEffect(() => {
    if (contaPaiInicial) {
      setContaPai({
        id: contaPaiInicial.id,
        codigo: contaPaiInicial.codigo,
        designacao: contaPaiInicial.designacao,
      })
    }
  }, [contaPaiInicial])

  if (isEdicao && isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full max-w-xl" />
      </div>
    )
  }

  function onSubmit(values: ContaFormValues) {
    if (isEdicao) {
      editar.mutate(values, {
        onSuccess: () => navigate('/contabilidade/plano-de-contas'),
        onError: (error) => applyApiErrorsToForm(error, setError),
      })
    } else {
      criar.mutate(values, {
        onSuccess: () => navigate('/contabilidade/plano-de-contas'),
        onError: (error) => applyApiErrorsToForm(error, setError),
      })
    }
  }

  const aGuardar = criar.isPending || editar.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <PageHeader
        title={isEdicao ? 'Editar conta' : 'Nova conta'}
        breadcrumbs={[
          { label: 'Contabilidade', href: '/contabilidade' },
          { label: 'Plano de contas', href: '/contabilidade/plano-de-contas' },
          { label: isEdicao ? 'Editar' : 'Nova' },
        ]}
        actions={
          <Button type="submit" disabled={isSubmitting || aGuardar}>
            {aGuardar ? 'A guardar...' : 'Guardar'}
          </Button>
        }
      />

      <div className="space-y-1">
        <label htmlFor="codigo" className="text-sm text-text-secondary">
          Código
        </label>
        <Controller
          control={control}
          name="codigo"
          render={({ field }) => (
            <Input
              id="codigo"
              placeholder="Ex.: 1.1.01"
              aria-invalid={!!errors.codigo}
              {...field}
            />
          )}
        />
        {errors.codigo && <p className="text-sm text-danger">{errors.codigo.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="designacao" className="text-sm text-text-secondary">
          Designação
        </label>
        <Controller
          control={control}
          name="designacao"
          render={({ field }) => (
            <Input id="designacao" aria-invalid={!!errors.designacao} {...field} />
          )}
        />
        {errors.designacao && <p className="text-sm text-danger">{errors.designacao.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="tipo" className="text-sm text-text-secondary">
          Tipo
        </label>
        <Controller
          control={control}
          name="tipo"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="tipo" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPO_OPCOES.map((opcao) => (
                  <SelectItem key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="contaPai" className="text-sm text-text-secondary">
          Conta-pai (opcional)
        </label>
        <Controller
          control={control}
          name="contaPaiId"
          render={({ field }) => (
            <ContaCombobox
              id="contaPai"
              value={contaPai}
              selecionavel={(candidata) => candidata.id !== id}
              onChange={(proxima) => {
                setContaPai(
                  proxima
                    ? { id: proxima.id, codigo: proxima.codigo, designacao: proxima.designacao }
                    : null,
                )
                field.onChange(proxima?.id ?? null)
              }}
            />
          )}
        />
        <p className="text-sm text-text-muted">
          Define a hierarquia do plano de contas. Deixa vazio para uma conta de topo (classe 1–8).
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <p className="text-sm font-medium text-text-primary">Aceita lançamentos directos</p>
          <p className="text-sm text-text-muted">
            Desactiva para contas de agrupamento (não-folha) — só contas-folha entram em
            lançamentos.
          </p>
        </div>
        <Controller
          control={control}
          name="permiteLancamentos"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-label="Aceita lançamentos directos"
            />
          )}
        />
      </div>
    </form>
  )
}
