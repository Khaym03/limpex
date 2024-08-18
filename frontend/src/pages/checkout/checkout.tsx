import { useFadeIn } from '@/lib/animations'
import ListCostumers from './list-costumers'
import PaymentMethods from './payment-method'
import Preorder from './pre-order'
import { animated } from '@react-spring/web'
import { useContext } from 'react'
import { SalesCtx } from '@/context/sales-provider'
import { domain } from 'wailsjs/go/models'
import { SaveOrder } from 'wailsjs/go/sales/Sales'
import { useToast } from '@/components/ui/use-toast'

export default function Checkout() {
  const { setPaymentMethod, paymentMethod } = useContext(SalesCtx)

  

  return (
    <animated.section
      style={{ ...useFadeIn() }}
      className="flex justify-center items-center"
    >
      <div className="flex flex-row-reverse gap-4">
        <Preorder />
        <section className="flex flex-col gap-4">
          <PaymentMethods onChagePaymentMethod={setPaymentMethod} />
          <ListCostumers />
        </section>
      </div>
    </animated.section>
  )
}
