import { MapPin, ShoppingBag } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const sizes = {
  sm: { icon: 20, text: 'text-lg' },
  md: { icon: 28, text: 'text-xl' },
  lg: { icon: 36, text: 'text-2xl' },
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const s = sizes[size]
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron to-saffron-dark shadow-card">
        <ShoppingBag size={s.icon} className="text-white" strokeWidth={2} />
        <MapPin
          size={14}
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-forest p-0.5 text-white"
          fill="currentColor"
        />
      </div>
      {showText && (
        <div className="text-left">
          <p className={`font-bold leading-tight text-warm-900 ${s.text}`}>Kirana Connect</p>
        </div>
      )}
    </div>
  )
}
