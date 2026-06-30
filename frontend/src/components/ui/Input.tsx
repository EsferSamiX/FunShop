import { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
}

export default function Input({ label, icon, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`
            w-full py-3 pr-4 border rounded-xl text-sm text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent
            ${icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
