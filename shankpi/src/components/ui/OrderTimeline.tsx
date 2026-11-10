import { Check } from 'lucide-react'
import type { OrderStatus } from '../../types'
import { useTranslation } from '../../hooks/useTranslation'

const steps: { status: OrderStatus; key: 'step_placed' | 'step_accepted' | 'step_preparing' | 'step_ready' | 'step_done' }[] = [
  { status: 'PENDING', key: 'step_placed' },
  { status: 'ACCEPTED', key: 'step_accepted' },
  { status: 'PREPARING', key: 'step_preparing' },
  { status: 'READY', key: 'step_ready' },
  { status: 'COMPLETED', key: 'step_done' },
]

const statusOrder: OrderStatus[] = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED']

function stepIndex(status: OrderStatus): number {
  if (status === 'REJECTED') return -1
  return statusOrder.indexOf(status)
}

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const { t } = useTranslation()
  const current = stepIndex(status)
  const rejected = status === 'REJECTED'

  if (rejected) {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-center text-red-700">
        {t('rejected_status')}
      </div>
    )
  }

  return (
    <ol className="space-y-0">
      {steps.map((step, i) => {
        const done = i <= current
        const active = i === current
        return (
          <li key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  done
                    ? 'border-forest bg-forest text-white'
                    : 'border-warm-200 bg-white text-warm-800/40'
                } ${active ? 'ring-4 ring-forest/20' : ''}`}
              >
                {done ? <Check size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`my-1 min-h-[24px] w-0.5 flex-1 ${i < current ? 'bg-forest' : 'bg-warm-200'}`}
                />
              )}
            </div>
            <div className={`pb-6 pt-1 ${active ? 'font-semibold text-forest' : done ? 'text-warm-800' : 'text-warm-800/50'}`}>
              {t(step.key)}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
