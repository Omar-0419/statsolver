import type { Metadata } from 'next'
import { AppShell } from '@/components/layout/AppShell'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'STAT SOLVER', template: '%s | STAT SOLVER' },
  description:
    'Plataforma educativa e interactiva para el aprendizaje y la resolución de problemas de Estadística Inferencial.',
  keywords: [
    'estadística',
    'inferencia estadística',
    'intervalos de confianza',
    'pruebas de hipótesis',
    'calculadoras estadísticas',
    'distribución normal',
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
