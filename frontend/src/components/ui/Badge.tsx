import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        {
          'bg-primary/10 text-primary border-primary/20': variant === 'default',
          'bg-success/10 text-success border-success/20': variant === 'success',
          'bg-warning/10 text-warning border-warning/20': variant === 'warning',
          'bg-error/10 text-error border-error/20': variant === 'error',
          'bg-info/10 text-info border-info/20': variant === 'info',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
