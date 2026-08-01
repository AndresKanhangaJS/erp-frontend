export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'contabilista'
  | 'gestor_comercial'
  | 'operador_rh'
  | 'operador_stock'
  | 'operador_caixa'
  | 'readonly'

export const USER_ROLES: UserRole[] = [
  'super_admin',
  'admin',
  'contabilista',
  'gestor_comercial',
  'operador_rh',
  'operador_stock',
  'operador_caixa',
  'readonly',
]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super administrador',
  admin: 'Administrador',
  contabilista: 'Contabilista',
  gestor_comercial: 'Gestor comercial',
  operador_rh: 'Operador de RH',
  operador_stock: 'Operador de stock',
  operador_caixa: 'Operador de caixa',
  readonly: 'Apenas leitura',
}

export interface Utilizador {
  id: string
  nome: string
  email: string
  mustChangePassword: boolean
  roles: string[]
  permissions: string[]
}
