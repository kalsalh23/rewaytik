import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          {
            'gradient-primary text-white hover:opacity-90 shadow-sm hover:shadow-md': variant === 'primary',
            'bg-secondary text-white hover:bg-secondary-light shadow-sm': variant === 'secondary',
            'border-2 border-primary text-primary hover:bg-primary/5 bg-transparent': variant === 'outline',
            'text-secondary hover:bg-accent/50 bg-transparent': variant === 'ghost',
            'bg-error text-white hover:bg-error/90': variant === 'danger',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-7 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
