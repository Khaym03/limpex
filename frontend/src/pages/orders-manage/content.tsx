import { useContext } from 'react'
import DataTable from './data-table'
import OrderDetails from './order-details'
import { OrdersManagerCtx } from '@/context/orders-manager-provider'
import { columns } from './columns'
import { motion } from 'framer-motion'

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function Content() {
  const { orders } = useContext(OrdersManagerCtx)

  return (
    <motion.div variants={item} className="flex gap-8 mt-4 h-[555px]">
      <DataTable columns={columns} data={orders} />

      <OrderDetails />
    </motion.div>
  )
}
