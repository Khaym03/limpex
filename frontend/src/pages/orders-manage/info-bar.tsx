import CurrencyDisplay from '@/components/currency-display'
import { OrdersManagerCtx } from '@/context/orders-manager-provider'
import { cn } from '@/lib/utils'
import { useContext } from 'react'

export default function InfoBar() {
  const { orders } = useContext(OrdersManagerCtx)

  const totals = orders.reduce(
    (acc, currOrder) => {
      if (currOrder.status === 'paid') {
        acc.paid += currOrder.total_amount
      }

      if (currOrder.status === 'pending') {
        acc.pending += currOrder.total_amount
      }

      return acc
    },
    {
      paid: 0,
      pending: 0
    }
  )

  return (
    <ul className="flex justify-between w-full px-6 absolute bottom-4 left-0">
      <Info
        title="Deudas pendientes:"
        amount={totals.pending}
        color="border-yellow-500 dark:border-yellow-300"
      />
      <Info
        title="Pagadas:"
        amount={totals.paid}
        color="border-green-600 dark:border-green-400"
      />
    </ul>
  )
}

interface InfoProps {
  title: string
  amount: number
  color: string
}

function Info({ title, amount, color }: InfoProps) {
  return (
    <li className={cn('flex gap-2 border-l-4  pl-2', color)}>
      <span className="text-muted-foreground">{title}</span>
      <CurrencyDisplay amount={amount} />
    </li>
  )
}
