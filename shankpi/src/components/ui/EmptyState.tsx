import type { LucideIcon } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-warm-100">
        <Icon size={40} className="text-saffron/70" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-warm-900">{title}</h3>
      <p className="mt-2 max-w-xs text-base text-warm-800/70">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
