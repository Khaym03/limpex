import ListCostumers from './list-costumers'
import PaymentMethods from './payment-method'
import Preorder from './pre-order'
import { useContext } from 'react'
import { SalesCtx } from '@/context/sales-provider'

export default function Checkout() {
  const { setPaymentMethod } = useContext(SalesCtx)

  return (
    <div className="flex justify-center gap-4 w-full">
      <section className="flex flex-col gap-4 ">
        <PaymentMethods onChagePaymentMethod={setPaymentMethod} />
        <ListCostumers />
      </section>
      <Preorder />
    </div>
  )
}
