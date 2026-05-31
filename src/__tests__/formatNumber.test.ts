import { describe, it, expect } from 'vitest';
import { formatNumber } from '../utils/number';

describe('formatNumber', () => {
  it('returns "0" for 0', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats small integers with locale string', () => {
    const result = formatNumber(42);
    expect(result).toBe(Math.floor(42).toLocaleString());
  });

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1500)).toBe('1.50K');
  });

  it('formats exactly 1e3 with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.00K');
  });

  it('formats millions with M suffix', () => {
    expect(formatNumber(2500000)).toBe('2.50M');
  });

  it('formats exactly 1e6 with M suffix', () => {
    expect(formatNumber(1e6)).toBe('1.00M');
  });

  it('formats billions with B suffix', () => {
    expect(formatNumber(3e9)).toBe('3.00B');
  });

  it('formats exactly 1e9 with B suffix', () => {
    expect(formatNumber(1e9)).toBe('1.00B');
  });

  it('formats trillions with T suffix', () => {
    expect(formatNumber(7e12)).toBe('7.00T');
  });

  it('formats exactly 1e12 with T suffix', () => {
    expect(formatNumber(1e12)).toBe('1.00T');
  });

  it('formats quadrillions (1e15) using the suffix array', () => {
    // 1e15 = 1000^5, exponent = 5, suffixIndex = 0 → suffixes[0] = 'K'
    const result = formatNumber(1e15);
    expect(result).toContain('K');
  });

  it('formats 1e18 using suffix array', () => {
    // 1e18 = 1000^6, exponent = 6, suffixIndex = 1 → 'M'
    const result = formatNumber(1e18);
    expect(result).toContain('M');
  });

  it('formats very large numbers beyond suffix array with exponential', () => {
    const result = formatNumber(1e60);
    expect(result).toContain('e');
  });

  it('handles 999 correctly (below 1e3)', () => {
    const result = formatNumber(999);
    expect(result).toBe(Math.floor(999).toLocaleString());
  });
});
