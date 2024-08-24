import CurrencyDisplay from '@/components/currency-display'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { PaymentMethodType } from '@/config/app-config'
import { OrdersManagerCtx } from '@/context/orders-manager-provider'
import PaymentMethods from '@/pages/checkout/payment-method'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { GetTotalPayments, MakeAPartialPayment } from 'wailsjs/go/sales/Sales'

interface PayWholeOrderProps {
  reset: () => void
}

export function PayWholeOrder({ reset }: PayWholeOrderProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>('bio-pago')

  const { selectedOrder } = useContext(OrdersManagerCtx)

  const [pendingOwe, setPendingOwe] = useState(0)

  const [amount, setAmount] = useState(0)

  console.log(`pending ${pendingOwe}, amount ${amount}`)

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setAmount(Number(value))
  }

  useEffect(() => {
    const howMuchOwe = async () => {
      if (!selectedOrder) return

      const theAmountThatHasPaid = await GetTotalPayments(selectedOrder.id)
      setPendingOwe(selectedOrder.total_amount - theAmountThatHasPaid)
    }

    howMuchOwe()
  }, [selectedOrder])

  const { toast } = useToast()
  const makePartialPaymentToSelectedOrder = async (amount: number) => {
    if (!selectedOrder || amount <= 0 || amount > pendingOwe) return
    const msg = await MakeAPartialPayment(
      selectedOrder.id,
      amount,
      paymentMethod
    )

    if (msg.Success) {
      const { dismiss } = toast({
        title: 'Abono',
        description: `Se le ha abonado a la Order #${
          selectedOrder.id
        } un monto de $${amount}.`
      })

      reset()
      setTimeout(() => dismiss(), 3000)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mt-2" size={'sm'}>
          Pagar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Al seleccionar un metodo de pago se marcara esta orden como pagada
            en su totalidad.
          </AlertDialogDescription>

          <PaymentMethods
            className=" border-none shadow-none"
            onChagePaymentMethod={v => setPaymentMethod(v)}
          />

          <div className="flex flex-col gap-4 font-medium pb-6">
            <div className='flex flex-col gap-2'>
              <CardTitle>
                Abonar{' '}
                <span className="text-sm text-muted-foreground">
                  (opcional)
                </span>
              </CardTitle>
              <CardDescription>
                Tienes la opcion de abonar para ir disminuyendo la deuda
                acumlulada. Para hacerlo solo agrega un monto y haz click en Abonar.
              </CardDescription>
            </div>
            <div>
              <div className="flex gap-2 mb-2">
                <span className="text-muted-foreground/80">Deuda pendiente:</span>
                <CurrencyDisplay amount={pendingOwe}/>
                {/* <span>{formatCurrecy(pendingOwe)}</span> */}
              </div>

              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={handleOnchange}
                />

                <AlertDialogAction
                  onClick={() => makePartialPaymentToSelectedOrder(amount)}
                >
                  Abonar
                </AlertDialogAction>
              </div>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (pendingOwe) makePartialPaymentToSelectedOrder(pendingOwe)
            }}
          >
            Pagar por completo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
