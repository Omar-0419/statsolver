export interface StudyCaseReference {
  procedureId: string
  steps: string[]
  ficha: { problema: string; fórmula: string }
  resultado: string
  interpretacion: string
  comparar?: string
}

export interface StudyCase {
  id: string
  unit: number
  title: string
  contexto: string
  enunciado: string
  datos: string
  objetivo: string
  tipo: string
  dificultad: 'Introductorio' | 'Intermedio' | 'Avanzado'
  referencia: StudyCaseReference
}

export const studyCases: StudyCase[] = [
  {
    id: 'caso-1-1',
    unit: 1,
    title: 'Variación del índice de glucemia en una muestra de adultos',
    contexto:
      'Un hospital de referencia quiere saber si el promedio del índice de glucemia en la población adulta está abajo del nivel de referencia de 7,4 mmol/L. Para ello, un bioquímico toma una muestra aleatoria de 36 adultos.',
    enunciado:
      'Dada una población con media µ = 7,4 mmol/L y desviación σ = 1,2 mmol/L, se toma una muestra aleatoria de n = 36 adultos. La media de la muestra resultó ser X̄ = 7,0 mmol/L. ¿Cuál es la probabilidad de obtener una media igual o inferior a 7,0 mmol/L? Si esta probabilidad es muy pequeña, ¿es razonable concluir que µ es menor que 7,4?',
    datos: 'µ = 7,4; σ = 1,2; n = 36; X̄ = 7,0',
    objetivo: 'Calcular P(X̄ ≤ 7,0) y evaluar si la evidencia sugiere que µ < 7,4.',
    tipo: 'Distribución muestral de la media',
    dificultad: 'Introductorio',
    referencia: {
      procedureId: 'media_muestral',
      steps: [
        'Calcular el error estándar: SE = σ/√n = 1,2/√36 = 0,2',
        'Calcular el estadístico Z: Z = (X̄ − µ)/SE = (7,0 − 7,4)/0,2 = −2',
        'Evaluar Φ(−2) = P(X̄ ≤ 7,0) = 0,0228',
      ],
      ficha: { problema: '¿Cuál es la probabilidad de que la media de la muestra sea ≤ 7,0?', fórmula: 'P(X̄ ≤ x̄) = Φ((x̄ − µ)/(σ/√n))' },
      resultado: 'P(X̄ ≤ 7,0) ≈ 0,0228',
      interpretacion:
        'La probabilidad de obtener una media igual o inferior a 7,0 es aproximadamente 2,3 %. Al ser menor que 5 %, hay evidencia de que µ es menor que 7,4, aunque eventos raros también son posibles; se recomienda repetir la muestra para reforzar la conclusión.',
      comparar: 'Solución: el valor p ≈ 0,023 < 0,05 indica evidencia de que µ < 7,4; el procedimiento es válido.',
    },
  },
  {
    id: 'caso-1-2',
    unit: 1,
    title: 'Llegadas de soporte técnico por minuto',
    contexto:
      'Un centro de soporte recibe un número variable de llamadas por minuto. Se modela el número de llamadas de entrada en un intervalo de 5 minutos con una distribución de Poisson.',
    enunciado:
      'Si el número medio de llamadas por minuto es λ = 3,5, ¿cuál es la probabilidad de recibir exactamente 5 llamadas en un intervalo de 5 minutos? ¿Y la probabilidad de recibir como máximo 5 llamadas?',
    datos: 'λ = 3,5; k = 5',
    objetivo: 'Calcular P(X = 5) y P(X ≤ 5) con λ = 3,5.',
    tipo: 'Distribución de Poisson',
    dificultad: 'Introductorio',
    referencia: {
      procedureId: 'poisson',
      steps: [
        'Calcular P(X = 5) = (λ^5·e^(−λ))/5! = (3,5^5·e^(−3,5))/120 ≈ 0,1321',
        'Calcular P(X ≤ 5) = Σ_{i=0}^{5} P(X = i) ≈ 0,8575',
      ],
      ficha: { problema: '¿Probabilidad de 5 llamadas?', fórmula: 'P(X = k) = (λ^k·e^(−λ))/k!' },
      resultado: 'P(X = 5) ≈ 0,1321, P(X ≤ 5) ≈ 0,8575',
      interpretacion:
        'Es razonable esperar 5 llamadas en un intervalo de 5 minutos con una probabilidad de aproximadamente 13 %; la probabilidad acumulada de recibir 5 o menos llamadas es aproximadamente 86 %.',
    },
  },
  {
    id: 'caso-2-1',
    unit: 2,
    title: 'Tamaño de muestra para estimar la proporción de clientes satisfechos',
    contexto:
      'Un gerente de marketing busca estimar la proporción de clientes satisfechos con una encuesta. Para planificar la muestra, debe conocer el número de encuestas necesarias.',
    enunciado:
      'Se desea estimar la proporción p de clientes satisfechos con un margen de error del 3 % (e = 0,03) al nivel de confianza del 95 %. ¿Cuántas encuestas debe realizarse?',
    datos: 'e = 0,03; nivel de confianza = 95 %; p estimada = 0,7',
    objetivo: 'Calcular n = z²·p(1−p)/e² y, si corresponde, el tamaño con población finita.',
    tipo: 'Tamaño de muestra para proporción',
    dificultad: 'Introductorio',
    referencia: {
      procedureId: 'tamaño_proporcion',
      steps: [
        'Calcular z para el 95 %: z = 1,96',
        'Calcular p(1−p) = 0,7·0,3 = 0,21',
        'Calcular n₀ = z²·p(1−p)/e² = 1,96²·0,21/0,0009 ≈ 897',
      ],
      ficha: { problema: '¿Cuántas encuestas se necesitan?', fórmula: 'n = z²·p(1−p)/e²' },
      resultado: 'n ≈ 897 encuestas',
      interpretacion:
        'Se requiere una muestra de aproximadamente 897 encuestas para estimar la proporción de clientes satisfechos con un margen de error del 3 % al nivel de confianza del 95 %.',
    },
  },
  {
    id: 'caso-2-2',
    unit: 2,
    title: 'Estimación del salario medio de una empresa',
    contexto:
      'Un contratista estudia la variabilidad salarial de una empresa. Con una muestra de trabajadores obtiene una media y una desviación estándar.',
    enunciado:
      'La desviación estándar de los salarios es σ = 400 y se observa una muestra de n = 50 trabajadores con salario promedio X̄ = 2500. Estime el salario medio de la empresa y su error estándar.',
    datos: 'X̄ = 2500; s = 400; n = 50',
    objetivo: 'Calcular la estimación puntual µ̂ = X̄ y el error estándar SE = s/√n.',
    tipo: 'Estimación de la media',
    dificultad: 'Intermedio',
    referencia: {
      procedureId: 'estim_media',
      steps: [
        'Estimación puntual del promedio poblacional: X̄ = 2500',
        'Calcular el error estándar: SE = s/√n = 400/√50 ≈ 56,57',
      ],
      ficha: { problema: '¿Cómo se estima el salario medio?', fórmula: 'X̄, SE = s/√n' },
      resultado: 'µ̂ = 2500, SE ≈ 56,57',
      interpretacion:
        'El salario medio se estima en 2500 con un error estándar de aproximadamente 56,57; es decir, el promedio esperado de la población se encuentra cerca de 2500 con esta incertidumbre.',
    },
  },
  {
    id: 'caso-3-1',
    unit: 3,
    title: 'Intervalo de confianza para la media de la producción de alta calidad',
    contexto:
      'En una planta de productos de alta calidad, se realiza un muestreo de un proceso y se obtiene la media de producción de un lote.',
    enunciado:
      'Un proceso está produciendo una media de producción de X̄ = 5,8 con desviación s = 0,9 en una muestra de n = 64 unidades. Calcule el intervalo de confianza para µ al 95 % usando la distribución t de Student.',
    datos: 'X̄ = 5,8; s = 0,9; n = 64; nivel de confianza = 95 %',
    objetivo: 'Calcular el intervalo de confianza para µ con distribución t.',
    tipo: 'Intervalo de confianza para una media (T)',
    dificultad: 'Intermedio',
    referencia: {
      procedureId: 'ci_media_t',
      steps: [
        'Calcular el error estándar: SE = s/√n = 0,9/√64 = 0,1125',
        'Buscar el valor crítico: t_{0,025, 63} ≈ 1,998 (gl = 63)',
        'Calcular el margen de error: ME = 1,998·0,1125 ≈ 0,2248',
      ],
      ficha: { problema: '¿Cuál es el IC para la media del proceso?', fórmula: 'X̄ ± t_{α/2, gl}·(s/√n)' },
      resultado: 'IC ≈ [5,5753, 6,0247]',
      interpretacion:
        'El intervalo de confianza al 95 % para la media del proceso es aproximadamente [5,5753, 6,0247]; con un nivel de confianza del 95 %, µ se encuentra entre estos límites.',
    },
  },
  {
    id: 'caso-3-2',
    unit: 3,
    title: 'Intervalo de confianza para la proporción de votantes favorables',
    contexto:
      'Un periódico regional realiza una encuesta de opinión para estimar la proporción de votantes favorables a un candidato.',
    enunciado:
      'Un encuesta obtiene pHat = 0,58 de la proporción de votantes favorables al candidato. Con una muestra de n = 400 votantes, calcule el intervalo de confianza al 95 % para p.',
    datos: 'p̂ = 0,58; n = 400; nivel de confianza = 95 %',
    objetivo: 'Calcular el intervalo de confianza para p con distribución Z.',
    tipo: 'Intervalo de confianza para una proporción',
    dificultad: 'Intermedio',
    referencia: {
      procedureId: 'ci_proporcion',
      steps: [
        'Calcular el error estándar: SE = √[p̂(1−p̂)/n] = √[0,58·0,42/400] ≈ 0,0247',
        'Calcular el estadístico crítico: z = 1,96',
        'Calcular el margen de error: ME ≈ 0,0484',
      ],
      ficha: { problema: '¿Cuál es el IC para la proporción de votantes favorables?', fórmula: 'p̂ ± z·√[p̂(1−p̂)/n]' },
      resultado: 'IC ≈ [0,5316, 0,6284]',
      interpretacion:
        'El intervalo de confianza al 95 % para la proporción de votantes favorables es aproximadamente [0,5316, 0,6284]; esto indica que el candidato tiene ventaja positiva según la evidencia de la muestra.',
    },
  },
  {
    id: 'caso-4-1',
    unit: 4,
    title: 'Prueba de hipótesis: efecto de una nueva pastilla en la presión arterial',
    contexto:
      'Estudio clínico comparando la presión arterial sistólica media en tratamiento con una nueva pastilla versus el nivel normal.',
    enunciado:
      'Se sabe que la presión arterial media sistólica en la población es µ₀ = 85 mmHg con desviación σ = 10 mmHg. Con una muestra de n = 36 pacientes tratados con la nueva pastilla, se observa una media de X̄ = 90 mmHg. Pruebe la hipótesis nula de que el nuevo tratamiento no cambia la presión (µ = 85) contra la alternativa bilateral al nivel α = 0,05.',
    datos: 'X̄ = 90; µ₀ = 85; σ = 10; n = 36; α = 0,05; alternativa: bilateral',
    objetivo: 'Calcular el estadístico z, el valor crítico, el valor p y la decisión estadística.',
    tipo: 'Prueba Z para una media',
    dificultad: 'Intermedio',
    referencia: {
      procedureId: 'prueba_z_media',
      steps: [
        'Calcular z = (X̄ − µ₀)/(σ/√n) = (90 − 85)/(10/√36) = 3',
        'Valor crítico bilateral: z_{0,025} = 1,96',
        'Valor p = 2·(1 − Φ(3)) ≈ 0,0027',
      ],
      ficha: { problema: '¿Hay evidencia de que el tratamiento cambia la presión?', fórmula: 'z = (X̄ − µ₀)/(σ/√n)' },
      resultado: 'z = 3, valor p ≈ 0,0027 → se rechaza H₀',
      interpretacion:
        'La prueba indica evidencia significativa de que el tratamiento aumenta la presión arterial sistólica respecto al nivel normal (µ₀ = 85) al nivel de significancia α = 0,05. Se rechaza H₀: el valor p (≈ 0,0027) es menor que α.',
      comparar: 'Solución del solucionador: decision = rechazo_H0; el valor crítico bilateral es 1,96 y |z| = 3 > 1,96, consistente con la decisión.',
    },
  },
  {
    id: 'caso-4-2',
    unit: 4,
    title: 'Prueba de independencia: género y preferencia de producto',
    contexto:
      'Encuesta de preferencias de producto realizada a un grupo de 80 personas en un mercado regional.',
    enunciado:
      'De la encuesta se recolectaron: 18 mujeres que prefieren el producto A, 22 mujeres que prefieren el producto B, 30 hombres que prefieren el producto A y 10 hombres que prefieren el producto B. ¿Hay evidencia de que el género y la preferencia de producto están relacionados al nivel α = 0,05?',
    datos: 'Tabla: [[18, 22], [30, 10]]; α = 0,05',
    objetivo: 'Calcular el estadístico χ², los grados de libertad, el valor p y decidir sobre la independencia.',
    tipo: 'Prueba Chi-cuadrado de independencia',
    dificultad: 'Intermedio',
    referencia: {
      procedureId: 'chi2_indep',
      steps: [
        'Tabla de contingencia: [[18, 22], [30, 10]], totales: 40, 40; columnas: 48, 32; total: 80',
        'Valores esperados: E11 = 24, E12 = 16, E21 = 24, E22 = 16',
        'χ² = Σ[(O − E)²/E] = 1,5 + 2,25 + 1,5 + 2,25 = 7,5',
        'Valor p = 2·(1 − Φ(√7,5)) ≈ 0,0062',
      ],
      ficha: { problema: '¿Están relacionados el género y la preferencia de producto?', fórmula: 'χ² = Σ[(O − E)²/E]' },
      resultado: 'χ² = 7,5, gl = 1, p ≈ 0,0062 → se rechaza H₀',
      interpretacion:
        'Existe evidencia significativa de asociación entre el género y la preferencia de producto al nivel de significancia α = 0,05; se rechaza la hipótesis nula de independencia.',
      comparar: 'Solución del solucionador: decision = rechazo_H0; valor crítico χ²_{0,95,1} = 3,84 < χ² = 7,5.',
    },
  },
]
