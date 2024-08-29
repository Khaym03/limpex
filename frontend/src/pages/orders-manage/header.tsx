import { FileStack, FileClock, Scale } from 'lucide-react'
import { DatePicker } from '@/components/date-picker'
import { Search } from 'lucide-react'
import { DateRangePicker } from '@/components/date-range-picker'
import { useContext, useEffect, useState } from 'react'
import { OrdersManagerCtx } from '@/context/orders-manager-provider'
import {
  ListOrders,
  ListOrdersByDate,
  ListOrdersByDateRange,
  ListOrdersByStatus
} from 'wailsjs/go/sales/Sales'
import { Button } from '@/components/ui/button'
import { domain } from 'wailsjs/go/models'
import { getUserTimeZone } from '@/lib/utils'
import { SearchCustomers } from './search-customer'
import { motion } from 'framer-motion'

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function Header() {
  const {
    dateRange,
    setDateRange,
    date,
    setDate,
    allOrders,
    queryOrdersByDateRange,
    queryOrderByStatus
  } = useContext(OrdersManagerCtx)

  const [invalidRange, setInvalidRange] = useState(false)

  useEffect(
    () => setInvalidRange(!dateRange || !dateRange.from || !dateRange.to),
    [dateRange]
  )

  return (
    <motion.header variants={item} className="flex justify-between">
      <div className="flex gap-2">
        <Button
          className="font-normal"
          size={'icon'}
          variant={'outline'}
          onClick={allOrders}
        >
          <FileStack size={20}/>
        </Button>
        <Button
          className="font-normal"
          size={'icon'}
          variant={'outline'}
          onClick={() => queryOrderByStatus('pending')}
        >
          <FileClock size={20}/>
        </Button>
      </div>

      <SearchCustomers />
      <div className="flex gap-2">
        <DatePicker date={date} setDate={setDate} />
      </div>

      <div className="flex gap-2">
        <DateRangePicker date={dateRange} setDate={setDateRange} />
        <Button onClick={queryOrdersByDateRange} disabled={invalidRange}>
          <Search size={20} />
        </Button>
      </div>
    </motion.header>
  )
}
