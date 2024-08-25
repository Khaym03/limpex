import ListCostumers from './list-costumers'
import PaymentMethods from './payment-method'
import Preorder from './pre-order'
import { useContext } from 'react'
import { SalesCtx } from '@/context/sales-provider'

export default function Checkout() {
  const { setPaymentMethod } = useContext(SalesCtx)

  return (
    <section className="flex justify-center items-center">
      <div className="flex flex-row-reverse gap-4">
        <Preorder />
        <section className="flex flex-col gap-4">
          <PaymentMethods onChagePaymentMethod={setPaymentMethod} />
          <ListCostumers />
        </section>
      </div>
    </section>
  )
}
