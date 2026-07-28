/**
 * O NIF angolano varia de formato entre pessoas singulares (pode incluir
 * letras, ex. do BI) e colectivas — não há um padrão único de dígitos
 * para forçar aqui. Normaliza só o que é seguro: espaços e maiúsculas.
 */
export function formatNIF(nif: string): string {
  return nif.trim().toUpperCase()
}
