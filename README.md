# STAT SOLVER

Plataforma educativa e interactiva para el aprendizaje y la resolución de problemas de Estadística Inferencial. Aplicación web moderna, visualmente atractiva y académicamente correcta, en español, sin bases de datos ni autenticación, con cálculos realizados localmente.

## Descripción

STAT SOLVER permite estudiar las unidades de Estadística Inferencial, utilizar calculadoras automatizadas, introducir datos de problemas reales y resolver casos de estudio paso a paso. Todo el proceso es local: no se requieren servicios externos, ni claves API, ni backends.

## Tecnologías utilizadas

- **Next.js 16.4.6** (App Router, Cache Components)
- **React 19.3.0**
- **TypeScript 5.9.3**
- **Tailwind CSS 4.3.3**
- **Lucide React** (iconos)
- **Recharts 3.11** (visualizaciones estadísticas)
- **Vitest 5.1.1** (pruebas unitarias)

Biblioteca estadística propia (`src/lib/statistics/`): series de potencias, fracciones continuas de Lentz, funciones especiales (gamma, beta regularizada, incomplete gamma), distribución normal/t/chi-cuadrado, binomial, Poisson y módulos de intervalos de confianza y pruebas de hipótesis.

## Requisitos

- Node.js ≥ 20 (recomendado LTS)
- npm

## Instalación y ejecución local

```bash
npm install
npm run dev          # desarrollo: npm run dev
npm run build        # compilar para producción
npm run start        # servir la aplicación compilada
npm test             # ejecutar pruebas unitarias (Vitest)
```

## Estructura del proyecto

```
src/
  app/                          # páginas (rutas) de la aplicación
    page.tsx                    # Dashboard principal (Inicio)
    layout.tsx                  # layout raíz (tema, shell)
    unidad-1/ ... unidad-4/     # Unidades 1-4: teoría + calculadoras
    calculadoras/               # catálogo de calculadoras
    calculadoras/[slug]/        # página individual de cada calculadora
    casos-estudio/              # biblioteca de casos de estudio
    casos-estudio/[id]/         # detalle de un caso (con solución explicada)
    solucionador/               # solucionador de casos de estudio
    acerca/                     # página acerca del proyecto
  components/
    ui/                         # Button, Card, Input, Select, Textarea, Badge, CopyButton, StatCard, SectionTitle
    theme/                      # ThemeProvider (modo claro/oscuro)
    layout/                     # AppShell (sidebar, navegación adaptativa, tema)
    dashboard/                  # WelcomeHero, UnitCard
    calculators/                # distribuciones, estimation, confidence, hypothesis + shared/
    charts/                     # NormalCharts (Recharts)
    solver/                     # GuidedSolver, AutoSolver, SolverStages
    study-cases/                # StudyCaseCard, StudyCaseDetail
    units/                      # Unit1Content .. Unit4Content (teoría y calculadoras)
  lib/
    statistics/                 # special-functions, distributions, estimation,
                                #   confidence-intervals, hypothesis-testing,
                                #   validations, formatting, types
    solver/                     # patterns (reconocimiento local de patrones), procedure-map
    data/                       # study-cases (casos de estudio)
    nav.ts                      # definición de la navegación
  lib/statistics/__tests__/     # pruebas unitarias de las matemáticas (22 tests)
```

## Funcionalidades

- **Dashboard**: bienvenida, descripción del proyecto, accesos a las 4 unidades, calculadoras, solucionador y casos de estudio, resumen visual.
- **Unidades 1-4**: teoría, fórmulas, conceptos y las calculadoras correspondientes a cada unidad.
- **Catálogo de calculadoras** (`/calculadoras`): visual con todas las herramientas disponibles; cada calculadora tiene su propia interfaz.
- **Calculadoras** (22 total):
  - Unidad 1: probabilidad normal, binomial, Poisson, distribución muestral de la media y de la proporción.
  - Unidad 2: tamaño de muestra para media/proporción, estimación de la media y proporción, error estándar.
  - Unidad 3: intervalos de confianza (media Z/t, proporción, diferencia de medias, diferencia de proporciones).
  - Unidad 4: pruebas Z/T para medias, pruebas para diferencias, Chi-cuadrado de independencia y de bondad de ajuste.
  - Cada una muestra: estadísticos, desarrollo matemático paso a paso, interpretación, gráfico (donde corresponde) y botón para copiar los resultados.
- **Solucionador de casos** (`/solucionador`):
  - Modo guiado: selecciona unidad y procedimiento, ingresa datos, resuelve.
  - Modo asistido automático: pega un enunciado; el sistema aplica reglas locales para detectar números y términos, sugiere el procedimiento y solicita verificación antes de ejecutar.
- **Casos de estudio** (`/casos-estudio`): 8 casos (2 por unidad) con contexto realista, datos coherentes, enunciado, objetivo y solución explicada de referencia.
- **Modo claro/oscuro** según preferencia del usuario.
- **Responsive**: sidebar en escritorio, navegación adaptativa en móviles.

## Fórmulas estadísticas implementadas

- Distribución normal: `Φ(z) = ½(1 + erf(z/√2))`, con `erf(x) = 1 − Q(½, x²)` y `Q(a,x)` gamma regularizada superior.
- Binomial: `P(X = k) = C(n,k)·p^k·(1−p)^(n−k)`; acumulada `P(X ≤ k) = I_{1−p}(n−k, k+1)` (beta regularizada).
- Poisson: `P(X = k) = (λ^k·e^(−λ))/k!`.
- T de Student: `F(t, df) = 1 − ½·I_{df/(df+t²)}(df/2, ½)`.
- Chi-cuadrado: `F(x, df) = P(df/2, x/2)` (gamma regularizada).
- Intervalos: media conocida `x̄ ± z·(σ/√n)`; media desconocida `x̄ ± t·(s/√n)`; proporción `p̂ ± z·√[p̂(1−p̂)/n]`; diferencias de medias (Welch) y proporciones.
- Pruebas: z/t para medias y proporciones, diferencias, Chi-cuadrado de independencia y bondad de ajuste.
- Error estándar: `SE(X̄) = σ/√n`, `SE(p̂) = √[p(1−p)/n]`.

## Pruebas

```bash
npm test
```

22 pruebas unitarias con valores conocidos (precisión de distribuciones y intervalos).

## Notas

- No se simula inteligencia artificial: el solucionador asistido usa reglas locales estáticas sobre el texto introducido.
- No se usan bases de datos ni autenticación, por restricción del enunciado.
- Los cálculos se realizan directamente en la aplicación (sin servicios externos).
