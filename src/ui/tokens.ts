/** Canopy Ascent — shared color tokens. Keep in sync with src/index.css @theme. */
export const palette = {
  bg: '#07140f',
  panel: '#10241b',
  raised: '#173228',
  line: '#3d6b52',
  text: '#f3f7f1',
  muted: '#c9ddd0',
  sap: '#ffe08a',
  ink: '#1c1406',
  leaf: '#b6f5cf',
  leafBtn: '#14663a',
  onLeaf: '#f4fff8',
  hp: '#ffb4b4',
  info: '#c5e4ff',
  warn: '#ffd7a8',
  danger: '#8f2424',
  onDanger: '#fff5f5',
} as const

export type PaletteName = keyof typeof palette

/** Foreground/background pairs that must stay at or above WCAG AA for body text. */
export const contrastPairs: ReadonlyArray<readonly [string, string, string]> = [
  ['text on panel', palette.text, palette.panel],
  ['text on bg', palette.text, palette.bg],
  ['muted on panel', palette.muted, palette.panel],
  ['muted on bg', palette.muted, palette.bg],
  ['muted on raised', palette.muted, palette.raised],
  ['sap on panel', palette.sap, palette.panel],
  ['sap on bg', palette.sap, palette.bg],
  ['ink on sap', palette.ink, palette.sap],
  ['onLeaf on leaf button', palette.onLeaf, palette.leafBtn],
  ['leaf on panel', palette.leaf, palette.panel],
  ['hp on panel', palette.hp, palette.panel],
  ['info on panel', palette.info, palette.panel],
  ['warn on panel', palette.warn, palette.panel],
  ['onDanger on danger', palette.onDanger, palette.danger],
]

export function relativeLuminance(hex: string): number {
  const value = hex.replace('#', '')
  const channels = [0, 2, 4].map(offset => {
    const channel = Number.parseInt(value.slice(offset, offset + 2), 16) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

export function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}
