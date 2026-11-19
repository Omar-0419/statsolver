export function formatNumber(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return 'N/A'
  const abs = Math.abs(value)
  if (abs !== 0 && abs < 0.0001) return value.toExponential(1)
  return Number(value.toFixed(digits)).toString()
}

export function formatPValue(p: number): string {
  if (!Number.isFinite(p)) return 'N/A'
  if (p < 0.0001) return '< 0.0001'
  return formatNumber(p, 4)
}
