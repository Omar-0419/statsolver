'use client'

import { Area, AreaChart, Line, LineChart, ReferenceLine, ResponsiveContainer } from 'recharts'

function normalPDF(x: number): number {
  return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI)
}

export interface NormalPDFChartProps {
  range?: [number, number]
  criticals?: number[]
  shade?: 'none' | 'lower-tail' | 'upper-tail' | 'two-sided'
}

/** Curva de la densidad de probabilidad de la normal estándar, con región de rechazo sombreada */
export function NormalPDFChart({ range = [-4, 4], criticals = [], shade = 'none' }: NormalPDFChartProps) {
  const n = 400
  const data: { x: number; pdf: number; shaded: number }[] = []
  for (let i = 0; i <= n; i++) {
    const x = range[0] + ((range[1] - range[0]) * i) / n
    const pdf = normalPDF(x)
    let inRejection = false
    if (shade === 'lower-tail' && criticals.length > 0) inRejection = x <= criticals[0]
    else if (shade === 'upper-tail' && criticals.length > 0) inRejection = x >= criticals[0]
    else if (shade === 'two-sided' && criticals.length >= 2) inRejection = x <= criticals[0] || x >= criticals[1]
    data.push({ x, pdf, shaded: inRejection ? pdf : 0 })
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <Area dataKey="pdf" type="monotone" stroke="none" fill="#d4d4d8" fillOpacity={0.05} />
          {shade !== 'none' ? <Area dataKey="shaded" type="monotone" stroke="none" fill="#7c3aed" fillOpacity={0.35} /> : null}
          <Line dataKey="pdf" type="monotone" stroke="#4f46e5" strokeWidth={2.5} dot={false} />
          {criticals.map((c, i) => (
            <ReferenceLine key={`crit-${i}`} x={c} stroke="#7c3aed" strokeWidth={2} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export interface NormalIntervalChartProps {
  statistic: number
  lower: number
  upper: number
  range?: [number, number]
}

/** Intervalo de confianza sobre la normal: estadístico central y límites con línea punteada */
export function NormalIntervalChart({ statistic, lower, upper, range }: NormalIntervalChartProps) {
  const dataRange: [number, number] = range ?? [lower - 3, upper + 3]
  const n = 200
  const data: { x: number; statistic: number; lower: number; upper: number }[] = []
  for (let i = 0; i <= n; i++) {
    const x = dataRange[0] + ((dataRange[1] - dataRange[0]) * i) / n
    data.push({ x, statistic, lower, upper })
  }
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, bottom: 0 }}>
          <Line dataKey="statistic" stroke="#7c3aed" strokeWidth={3} dot={false} />
          <Line dataKey="lower" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 4" dot={false} />
          <Line dataKey="upper" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
