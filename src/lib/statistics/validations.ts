export interface NumberValidation {
  ok: boolean
  value?: number
  error?: string
}

export interface TableValidation {
  ok: boolean
  error?: string
}

export function parseNumber(
  raw: string,
  opts: { label: string; positive?: boolean; integer?: boolean; min?: number; max?: number },
): NumberValidation {
  const { label, positive = false, integer = false, min, max } = opts
  const text = (raw ?? '').trim().replace(/,/g, '.')
  if (text === '') return { ok: false, error: `${label}: ingresa un valor numérico.` }
  const value = Number(text)
  if (!Number.isFinite(value)) return { ok: false, error: `${label}: el valor "${raw.trim()}" no es un número válido.` }
  if (positive && value <= 0) return { ok: false, error: `${label} debe ser mayor que cero.` }
  if (integer && !Number.isInteger(value)) return { ok: false, error: `${label} debe ser un entero.` }
  if (min !== undefined && value < min) return { ok: false, error: `${label} debe ser al menos ${min}.` }
  if (max !== undefined && value > max) return { ok: false, error: `${label} debe ser como máximo ${max}.` }
  return { ok: true, value }
}

export function validateTable(rows: number[][]): TableValidation {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { ok: false, error: 'La tabla debe tener al menos una fila.' }
  }
  const cols = rows[0].length
  for (const row of rows) {
    if (row.length !== cols) return { ok: false, error: 'La tabla debe ser rectangular.' }
    for (const cell of row) {
      if (!Number.isFinite(cell) || cell < 0) {
        return { ok: false, error: 'Los valores de la tabla deben ser números no negativos.' }
      }
    }
  }
  return { ok: true }
}
