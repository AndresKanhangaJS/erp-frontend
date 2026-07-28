import type { ReactElement } from 'react'
import type { Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField as RHFFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  control: Control<TFieldValues>
  name: TName
  label: string
  description?: string
  render: (field: ControllerRenderProps<TFieldValues, TName>) => ReactElement
}

/**
 * label + input + erro num só componente, por cima das peças cruas do
 * shadcn (FormItem/FormLabel/FormControl/FormMessage) — todo o input
 * criado com isto já sai com label associado (ADR-008).
 */
export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  description,
  render,
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <RHFFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{render(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
