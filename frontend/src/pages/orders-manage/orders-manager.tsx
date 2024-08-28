import OrdersMangerProvider from '@/context/orders-manager-provider'
import Content from './content'
import Header from './header'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0.5 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
}

export default function OrdersManger() {
  return (
    <OrdersMangerProvider>
      <section className="flex items-center h-screen p-4 relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="container max-w-6xl"
        >
          <Header />
          <Content />
        </motion.div>
      </section>
    </OrdersMangerProvider>
  )
}
