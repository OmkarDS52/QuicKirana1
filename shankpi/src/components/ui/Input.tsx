import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label.replace(/\s/g, '-').toLowerCase()
  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-warm-800">
        {label}
      </label>
      <input
        id={inputId}
        className={`min-h-12 w-full rounded-2xl border-2 bg-white px-4 text-base text-warm-900 outline-none transition-colors placeholder:text-warm-800/40 focus:border-saffron focus:ring-2 focus:ring-saffron/20 ${error ? 'border-red-400' : 'border-warm-200'} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
