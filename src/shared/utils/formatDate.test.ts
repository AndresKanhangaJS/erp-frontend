import { describe, expect, it } from 'vitest'

import { formatDate, formatDateTime } from './formatDate'

describe('formatDate', () => {
  it('formata no padrao dd/MM/yyyy, nunca MM/dd/yyyy', () => {
    expect(formatDate('2026-06-15T12:00:00Z')).toBe('15/06/2026')
  })

  it('converte para o fuso de Luanda (UTC+1), incluindo troca de dia', () => {
    // 23:30 UTC = 00:30 em Luanda (UTC+1, sem horario de verao) do dia seguinte
    expect(formatDate('2026-01-15T23:30:00Z')).toBe('16/01/2026')
  })
})

describe('formatDateTime', () => {
  it('inclui a hora de Luanda no formato dd/MM/yyyy HH:mm', () => {
    expect(formatDateTime('2026-06-15T10:05:00Z')).toBe('15/06/2026 11:05')
  })
})
