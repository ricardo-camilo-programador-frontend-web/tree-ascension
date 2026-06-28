const SUFFIXES = [
  '',
  'K',
  'M',
  'B',
  'T',
  'Qa',
  'Qi',
  'Sx',
  'Sp',
  'Oc',
  'No',
  'Dc',
  'UDc',
  'DDc',
  'TDc',
  'QaDc',
  'QiDc',
]

export const formatNumber = (num: number): string => {
  if (Number.isNaN(num)) return '0'
  if (!Number.isFinite(num)) return num > 0 ? '∞' : '-∞'
  if (num === 0) return '0'

  const abs = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  if (abs < 1000) {
    return sign + Math.floor(abs).toString()
  }

  const exponent = Math.floor(Math.log10(abs) / 3)
  const suffixIndex = Math.min(exponent, SUFFIXES.length - 1)
  const suffix = SUFFIXES[suffixIndex]
  const divisor = 1000 ** suffixIndex
  const formatted = (abs / divisor).toFixed(2)

  return sign + formatted + suffix
}
