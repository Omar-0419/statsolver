'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '@/components/theme/ThemeProvider'
import { navSections } from '@/lib/nav'

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  const renderNav = (onNavigate: () => void) => (
    <nav className="flex flex-col gap-0.5">
      {navSections.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-ss-primary-muted text-ss-primary'
                : 'text-ss-muted hover:bg-ss-surface-elevated hover:text-ss-fg'
            }`}
          >
            <Icon className={`h-[1.125rem] w-[1.125rem] ${active ? 'text-ss-primary' : 'text-ss-muted'}`} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-ss-bg text-ss-fg">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-ss-border bg-ss-surface transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-ss-border px-5">
          <Link href="/" className="text-lg font-bold tracking-tight text-ss-fg">
            STAT <span className="text-ss-primary">SOLVER</span>
          </Link>
          <button
            type="button"
            className="ml-auto md:hidden text-ss-muted hover:text-ss-fg"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-1 p-4">{renderNav(() => setMobileOpen(false))}</div>
        <div className="mt-auto border-t border-ss-border p-4">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ss-muted transition-colors hover:bg-ss-surface-elevated hover:text-ss-fg"
            onClick={toggle}
            aria-label="Cambiar modo claro/oscuro"
          >
            {theme === 'dark' ? <Sun className="h-[1.125rem] w-[1.125rem]" /> : <Moon className="h-[1.125rem] w-[1.125rem]" />}
            <span className="md:hidden">{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
            <span className="hidden md:inline">{theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}</span>
          </button>
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-ss-bg/80 backdrop-blur-sm transition-opacity md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ss-border bg-ss-surface/90 backdrop-blur px-4 py-3 md:hidden">
          <button
            type="button"
            className="text-ss-muted hover:text-ss-fg"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-ss-fg">STAT SOLVER</span>
          <span className="ml-auto">
            <button
              type="button"
              className="text-ss-muted hover:text-ss-fg"
              onClick={toggle}
              aria-label="Cambiar modo claro/oscuro"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </span>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  )
}
