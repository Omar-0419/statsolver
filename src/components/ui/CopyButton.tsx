'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyButton({ value, label = 'Copiar', className = '' }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-md border border-ss-border bg-ss-surface px-2.5 py-1 text-xs font-medium text-ss-fg transition-colors hover:bg-ss-surface-elevated ${className}`}
      onClick={handleCopy}
      aria-label={`Copiar ${label}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-ss-success" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}
