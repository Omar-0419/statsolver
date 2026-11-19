// Funciones especiales necesarias para la Estadística Inferencial.
// Series de potencias y fracciones continuas (método de Lentz), inspiradas
// en Numerical Recipes. Resultados con precisión del orden de 1e-14.

const EPSILON = 1e-14
const FPMIN = 1e-300

// --- Función gamma y log-gamma (Lanczos, g = 7) ---
const LANCZOS_G = 7
const LANCZOS_COEFS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
]

export function lgamma(z: number): number {
  if (!Number.isFinite(z) || z === 0) return Number.NaN
  if (z < 0.5) {
    // Reflexión de Euler: Gamma(z) = π / (sen(πz) · Gamma(1 − z))
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - lgamma(1 - z)
  }
  z -= 1
  let x = LANCZOS_COEFS[0]
  for (let i = 1; i < LANCZOS_COEFS.length; i++) {
    x += LANCZOS_COEFS[i] / (z + i)
  }
  const t = z + LANCZOS_G + 0.5
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x)
}

export function gamma(z: number): number {
  return Math.exp(lgamma(z))
}

// --- Bisección general: encuentra x tal que f(x) = target (f creciente) ---
export function bisectSolve(f: (x: number) => number, target: number, lo: number, hi: number, iterations = 200): number {
  let a = lo
  let b = hi
  for (let i = 0; i < iterations; i++) {
    const m = (a + b) / 2
    if (f(m) < target) a = m
    else b = m
  }
  return (a + b) / 2
}

// --- Gamma regularizado P(a, x) e Q(a, x) ---
export function regGammaP(a: number, x: number): number {
  if (a <= 0 || x < 0) return Number.NaN
  if (x === 0) return 0
  if (x < a + 1) {
    // Series: P(a, x) = exp(-x + a·ln x − lnΓ(a)) · Σ [x^k / (a(a+1)...)]
    let sum = 1 / a
    let del = sum
    for (let i = 0; i < 1000; i++) {
      const ap = a + i + 1
      del = (del * x) / ap
      sum += del
      if (Math.abs(del) < Math.abs(sum) * EPSILON) break
    }
    return sum * Math.exp((-x + a * Math.log(x)) - lgamma(a))
  }
  return 1 - regGammaQ(a, x)
}

export function regGammaQ(a: number, x: number): number {
  if (a <= 0 || x < 0) return Number.NaN
  if (x === 0) return 1
  // Fracción continua (Lentz) para Γ*(a, x) / Γ(a)
  let b = x + 1 - a
  let c = 1 / FPMIN
  let d = 1 / b
  let h = d
  for (let i = 1; i <= 1000; i++) {
    const an = -i * (i - a)
    b += 2
    d = an * d + b
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = b + an / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < EPSILON) break
  }
  return Math.exp((-x + a * Math.log(x)) - lgamma(a)) * h
}

// --- Beta regularizada I_x(a, b) ---
function betacf(a: number, b: number, x: number): number {
  const qab = a + b
  const qap = a + 1
  const qam = a - 1
  let c = 1
  let d = 1 - (qab * x) / qap
  if (Math.abs(d) < FPMIN) d = FPMIN
  d = 1 / d
  let h = d
  for (let m = 1; m <= 1000; m++) {
    const m2 = 2 * m
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    h *= d * c
    aa = -((a + m) * (qab + m) * x) / ((a + m2) * (qap + m2))
    d = 1 + aa * d
    if (Math.abs(d) < FPMIN) d = FPMIN
    c = 1 + aa / c
    if (Math.abs(c) < FPMIN) c = FPMIN
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < EPSILON) break
  }
  return h
}

export function betaIncReg(x: number, a: number, b: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const lbeta = lgamma(a + b) - lgamma(a) - lgamma(b)
  const bt = Math.exp(lbeta + a * Math.log(x) + b * Math.log(1 - x))
  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betacf(a, b, x)) / a
  }
  return 1 - (bt * betacf(b, a, 1 - x)) / b
}

// --- Normal ---
export function normalPDF(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI)
}

function erf(x: number): number {
  const e = 1 - regGammaQ(0.5, x * x)
  return x >= 0 ? e : -e
}

export function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2))
}

export function normalQuantile(p: number): number {
  if (p <= 0) return -Infinity
  if (p >= 1) return Infinity
  return bisectSolve(normalCDF, p, -40, 40)
}

// --- T de Student ---
export function tCDF(t: number, df: number): number {
  if (df <= 0) return Number.NaN
  const x = df / (df + t * t)
  const ib = betaIncReg(x, df / 2, 0.5)
  return t >= 0 ? 1 - 0.5 * ib : 0.5 * ib
}

export function tQuantile(p: number, df: number): number {
  if (p <= 0 || p >= 1) return Number.NaN
  return bisectSolve((m) => tCDF(m, df), p, -100, 100)
}

// --- Chi-cuadrado ---
export function chi2CDF(x: number, df: number): number {
  if (x < 0 || df <= 0) return Number.NaN
  return regGammaP(df / 2, x / 2)
}

export function chi2SF(x: number, df: number): number {
  return regGammaQ(df / 2, x / 2)
}

export function chi2Quantile(p: number, df: number): number {
  if (p <= 0 || p >= 1) return Number.NaN
  return bisectSolve((m) => chi2CDF(m, df), p, 0, 1e6)
}

// --- Binomial ---
export function binomialPmf(k: number, n: number, p: number): number {
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(k) || k < 0 || k > n) return 0
  if (p <= 0) return k === 0 ? 1 : 0
  if (p >= 1) return k === n ? 1 : 0
  return Math.exp(lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1) + k * Math.log(p) + (n - k) * Math.log(1 - p))
}

export function binomialCdf(k: number, n: number, p: number): number {
  if (k < 0) return 0
  if (k >= n) return 1
  if (p === 0) return 1
  if (p === 1) return 0
  // Identidad: P(X ≤ k) = I_{1−p}(n − k, k + 1)
  return betaIncReg(1 - p, n - k, k + 1)
}

export function binomialQuantile(p: number, n: number, prob: number): number {
  if (p <= 0) return 0
  if (p >= 1) return n
  let lo = 0
  let hi = n
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (binomialCdf(mid, n, prob) < p) lo = mid + 1
    else hi = mid
  }
  return lo
}

// --- Poisson ---
export function poissonPmf(k: number, lambda: number): number {
  if (lambda < 0 || !Number.isFinite(k) || k < 0) return 0
  if (lambda === 0) return k === 0 ? 1 : 0
  const kk = Math.floor(k)
  return Math.exp(kk * Math.log(lambda) - lambda - lgamma(kk + 1))
}

export function poissonCdf(k: number, lambda: number): number {
  if (k < 0) return 0
  const kk = Math.floor(k)
  let sum = 0
  for (let i = 0; i <= kk && i < 100000; i++) {
    sum += poissonPmf(i, lambda)
  }
  return sum
}

export function poissonQuantile(p: number, lambda: number): number {
  if (p <= 0) return 0
  let k = 0
  while (k < 100000 && poissonCdf(k, lambda) < p) k++
  return k
}
