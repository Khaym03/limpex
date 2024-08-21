import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { PaymentMethodType } from '@/config/app-config'
import PaymentMethods from '@/pages/checkout/payment-method'
import { useState } from 'react'

interface PayWholeOrderProps {
  markOrderAsPaid: (payment: PaymentMethodType) => Promise<void>
}

export function PayWholeOrder({ markOrderAsPaid }: PayWholeOrderProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>('bio-pago')

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='mt-2' size={'sm'}>Pagar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Al seleccionar un metodo de pago se marcara esta orden como pagada
            en su totalidad.
          </AlertDialogDescription>

          <PaymentMethods className=' border-none shadow-none' onChagePaymentMethod={v => setPaymentMethod(v)} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => markOrderAsPaid(paymentMethod)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
