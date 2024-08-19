import { Fingerprint, CreditCard, HandCoins, LucideProps } from 'lucide-react'

export type PaymentMethodType  = 'bio-pago' |'efectivo' | 'tarjeta'

export interface PaymentMethodDetails  {
    name: PaymentMethodType
    Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

export const PAYMENT_METHODS: PaymentMethodDetails[] = [
    {
        name: 'bio-pago',
        Icon: Fingerprint
    },
    {
        name: 'efectivo',
        Icon: HandCoins
    },
    {
        name: 'tarjeta',
        Icon: CreditCard
    },
]
