import ListCostumers from './list-costumers'
import PaymentMethods from './payment-method'
import Preorder from './pre-order'
import { useContext } from 'react'
import { SalesCtx } from '@/context/sales-provider'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0.5, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delayChildren: 0.5
    }
  }
}

export default function Checkout() {
  const { setPaymentMethod } = useContext(SalesCtx)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="flex justify-center gap-4 w-full"
    >
      <section className="flex flex-col gap-4 ">
        <PaymentMethods onChagePaymentMethod={setPaymentMethod} />
        <ListCostumers />
      </section>
      <Preorder />
    </motion.div>
  )
}
