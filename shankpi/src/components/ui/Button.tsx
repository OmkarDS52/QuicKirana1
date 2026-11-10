import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  children: ReactNode
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-saffron text-white hover:bg-saffron-dark active:scale-[0.98] shadow-md shadow-saffron/25',
  secondary:
    'bg-forest text-white hover:bg-forest-dark active:scale-[0.98] shadow-md shadow-forest/20',
  outline:
    'border-2 border-saffron text-saffron bg-transparent hover:bg-saffron/10 active:scale-[0.98]',
  ghost: 'text-forest hover:bg-forest/10 active:scale-[0.98]',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-10 px-4 text-sm rounded-xl',
  md: 'min-h-12 px-6 text-base rounded-2xl',
  lg: 'min-h-14 px-8 text-lg rounded-2xl font-semibold',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  children,
  loading,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        children
      )}
    </button>
  )
}
