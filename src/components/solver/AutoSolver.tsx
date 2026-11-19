'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { StepList } from '@/components/calculators/shared/StepList'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { SolverStages } from '@/components/solver/SolverStages'
import { analyzeStatement, UNIT_NAMES, type StatementAnalysis } from '@/lib/solver/patterns'
import { getProcedure, PROCEDURES } from '@/lib/solver/procedure-map'

export function AutoSolver() {
  const [statement, setStatement] = useState('')
  const [analysis, setAnalysis] = useState<StatementAnalysis | null>(null)
  const [procedureId, setProcedureId] = useState('')
  const [showStages, setShowStages] = useState(false)

  const procedure = getProcedure(procedureId)
  const Comp = procedure?.component

  const handleAnalyze = () => {
    const text = statement.trim()
    if (!text) {
      setAnalysis(null)
      setProcedureId('')
      setShowStages(false)
      return
    }
    const a = analyzeStatement(text)
    setAnalysis(a)
    setProcedureId(a.suggestedProcedureId ?? '')
    setShowStages(false)
  }

  const resetAll = () => {
    setStatement('')
    setAnalysis(null)
    setProcedureId('')
    setShowStages(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <SectionTitle
          title="Resolución asistida automática"
          subtitle="El sistema aplica reglas locales para detectar datos y procedimientos (sin IA); revisa siempre la sugerencia"
        />
        <Textarea
          label="Enunciado del problema"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="Ej: Una muestra de 36 observaciones de una población con desviación σ = 2 tiene una media de 10.5."
          help="Pega o escribe el enunciado del ejercicio"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleAnalyze} size="lg">
            Analizar enunciado
          </Button>
          <Button variant="secondary" onClick={resetAll}>
            Borrar todo
          </Button>
        </div>
      </Card>

      {analysis ? (
        <Card>
          <SectionTitle title="Análisis del enunciado" subtitle="Detección local de términos y números" />
          <StepList
            steps={[
              {
                label: 'Valores numéricos detectados',
                value: analysis.numbers.length ? analysis.numbers.map((n) => String(n)).join(', ') : 'Ninguno detectado',
              },
              {
                label: 'Términos detectados',
                value: analysis.detectedTerms.length ? analysis.detectedTerms.join(', ') : 'Ninguno detectado',
              },
              {
                label: 'Unidades identificadas',
                value: analysis.units.length ? analysis.units.map((u) => UNIT_NAMES[u - 1]).join(', ') : 'No claras',
              },
              { label: 'Procedimiento sugerido', value: analysis.suggestedProcedure ?? 'Ninguno detectado automáticamente' },
              { label: 'Confianza del análisis', value: `${analysis.confidence} %` },
            ]}
            copyText={analysis.summary}
          />
        </Card>
      ) : null}

      {analysis ? (
        <Card>
          <SectionTitle
            title="Completar datos y ejecutar"
            subtitle="Revisa y completa los valores, luego resuelve paso a paso"
          />
          <Select
            label="Procedimiento estadístico"
            value={procedureId}
            onChange={(e) => setProcedureId(e.target.value)}
          >
            <option value="">Selecciona el procedimiento…</option>
            {PROCEDURES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => setShowStages(true)} disabled={!procedureId} size="lg">
              Ver etapas del solucionador
            </Button>
          </div>
        </Card>
      ) : null}

      {showStages && procedureId ? (
        <SolverStages
          requested={procedure ? procedure.description : 'Procedimiento no definido'}
          unitName={analysis ? UNIT_NAMES[(analysis.unit ?? 1) - 1] : 'Unidad no identificada'}
          procedureId={procedureId}
        />
      ) : null}

      {Comp ? (
        <div className="flex flex-col gap-6">
          <SectionTitle title={`Calculadora de ${procedure!.name}`} subtitle={procedure!.description} />
          <Comp />
        </div>
      ) : null}
    </div>
  )
}
