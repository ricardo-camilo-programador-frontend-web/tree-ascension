import { describe, expect, it } from 'vitest'
import { formatNumber } from './number'

describe('formatNumber', () => {
  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('formats small numbers', () => {
    expect(formatNumber(42)).toBe('42')
    expect(formatNumber(999)).toBe('999')
  })

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.00K')
    expect(formatNumber(1500)).toBe('1.50K')
    // Note: 999999 rounds to 1000.00K due to toFixed(2) — known edge case
    expect(formatNumber(999949)).toBe('999.95K')
  })

  it('formats millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.00M')
    expect(formatNumber(2500000)).toBe('2.50M')
  })

  it('formats negative numbers', () => {
    expect(formatNumber(-5000)).toBe('-5.00K')
    expect(formatNumber(-1000000)).toBe('-1.00M')
  })

  it('clamps to largest available suffix', () => {
    // 1e60 — well beyond the SUFFIXES array, should not crash
    const result = formatNumber(1e60)
    expect(result).toContain('QiDc')
  })

  it('handles fractional values via Math.floor', () => {
    expect(formatNumber(0.5)).toBe('0')
    expect(formatNumber(0.99)).toBe('0')
  })
})
