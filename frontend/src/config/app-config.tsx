import { Fingerprint, CreditCard, HandCoins, LucideProps } from 'lucide-react'

export type PaymentMethodType = 'bio-pago' | 'efectivo' | 'tarjeta'

export interface PaymentMethodDetails {
  name: PaymentMethodType
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  styles: string
}

export const PAYMENT_METHODS: PaymentMethodDetails[] = [
  {
    name: 'bio-pago',
    Icon: Fingerprint,
    styles: 'text-red-500 dark:text-red-400 border-red-200 dark:border-red-400 bg-red-50 dark:bg-red-950/50'
  },
  {
    name: 'efectivo',
    Icon: HandCoins,
    styles: 'text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
  },
  {
    name: 'tarjeta',
    Icon: CreditCard,
    styles: 'text-blue-500 dark:text-blue-400 border-blue-200 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/50'
  }
]

export type OrderStatus = 'paid' | 'pending' | 'not-paid'
