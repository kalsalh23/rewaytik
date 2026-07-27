import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('ar-SA')} ل.س`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending_payment: 'bg-warning/10 text-warning border-warning/20',
    pending_review: 'bg-info/10 text-info border-info/20',
    payment_accepted: 'bg-success/10 text-success border-success/20',
    writing: 'bg-primary/10 text-primary border-primary/20',
    story_ready: 'bg-primary-light/10 text-primary border-primary-light/20',
    printing: 'bg-secondary/10 text-secondary border-secondary/20',
    printed: 'bg-secondary-light/10 text-secondary-light border-secondary-light/20',
    shipped: 'bg-info/10 text-info border-info/20',
    delivered: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-error/10 text-error border-error/20',
  }
  return colors[status] || 'bg-muted text-muted-foreground border-border'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending_payment: 'بانتظار الدفع',
    pending_review: 'بانتظار مراجعة الدفع',
    payment_accepted: 'تم قبول الدفع',
    writing: 'جاري كتابة القصة',
    story_ready: 'القصة جاهزة',
    printing: 'قيد الطباعة',
    printed: 'تمت الطباعة',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    rejected: 'مرفوض',
  }
  return labels[status] || status
}

export function getManuscriptStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-info/10 text-info border-info/20',
    under_review: 'bg-warning/10 text-warning border-warning/20',
    awaiting_client: 'bg-accent/10 text-accent-dark border-accent/20',
    designing: 'bg-primary/10 text-primary border-primary/20',
    formatting: 'bg-primary/10 text-primary border-primary/20',
    illustrating: 'bg-primary/10 text-primary border-primary/20',
    final_review: 'bg-secondary/10 text-secondary border-secondary/20',
    ready_to_print: 'bg-success/10 text-success border-success/20',
    completed: 'bg-success/10 text-success border-success/20',
    cancelled: 'bg-error/10 text-error border-error/20',
  }
  return colors[status] || 'bg-muted text-muted-foreground border-border'
}

export function getManuscriptStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: 'جديد',
    under_review: 'قيد المراجعة',
    awaiting_client: 'بانتظار العميل',
    designing: 'جاري التصميم',
    formatting: 'جاري التنسيق',
    illustrating: 'جاري إنشاء الرسومات',
    final_review: 'مراجعة نهائية',
    ready_to_print: 'جاهز للطباعة',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  }
  return labels[status] || status
}
