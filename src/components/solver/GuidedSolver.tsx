'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Textarea } from '@/components/ui/Textarea'
import { SolverStages } from '@/components/solver/SolverStages'
import { UNIT_NAMES, analyzeStatement } from '@/lib/solver/patterns'
import { getProcedure, proceduresByUnit } from '@/lib/solver/procedure-map'

export function GuidedSolver() {
  const [unit, setUnit] = useState('1')
  const [procedure, setProcedure] = useState('')
  const [statement, setStatement] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [showStages, setShowStages] = useState(false)

  const unitProcedures = proceduresByUnit(Number(unit))
  const selectedProcedure = getProcedure(procedure)
  const Comp = selectedProcedure?.component
  const unitName = UNIT_NAMES[Number(unit) - 1] ?? `Unidad ${unit}`

  const handleAnalyze = () => {
    const text = statement.trim()
    if (!text) {
      setAnalysis('Introduce el enunciado del problema para que el solucionador analice los datos y el procedimiento sugerido.')
      return
    }
    setAnalysis(analyzeStatement(text).summary)
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <SectionTitle
          title="Resolución guiada"
          subtitle="Selecciona la unidad y el procedimiento estadístico, luego ingresa los datos en la calculadora"
        />
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Unidad"
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value)
                setProcedure('')
                setShowStages(false)
              }}
            >
              {UNIT_NAMES.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {name}
                </option>
              ))}
            </Select>
            <Select label="Procedimiento estadístico" value={procedure} onChange={(e) => setProcedure(e.target.value)}>
              <option value="">Selecciona el procedimiento…</option>
              {unitProcedures.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <Textarea
            label="Enunciado del ejercicio (opcional, de referencia)"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            help="De referencia para la identificación del problema; el sistema no simula comprensión, revisa la correspondencia"
          />
          {analysis ? (
            <p className="rounded-lg border border-ss-border bg-ss-surface-elevated px-3 py-2 text-sm text-ss-fg">{analysis}</p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAnalyze} variant="secondary">
              Analizar enunciado
            </Button>
            <Button onClick={() => setShowStages((v) => !v)} disabled={!procedure} size="lg">
              {showStages ? 'Ocultar etapas' : 'Ver etapas del solucionador'}
            </Button>
          </div>
        </div>
      </Card>

      {showStages && procedure ? (
        <SolverStages requested={selectedProcedure!.description} unitName={unitName} procedureId={procedure} />
      ) : null}

      {Comp ? (
        <div className="flex flex-col gap-6">
          <SectionTitle title={`Calculadora de ${selectedProcedure!.name}`} subtitle={selectedProcedure!.description} />
          <Comp />
        </div>
      ) : null}
    </div>
  )
}
