import { FileStack, FileClock } from 'lucide-react'
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

export default function Header() {
  const {
    dateRange,
    setDateRange,
    date,
    setDate,
    allOrders,
    queryOrdersByDate,
    queryOrdersByDateRange,
    queryOrderByStatus
  } = useContext(OrdersManagerCtx)

  const [invalidRange, setInvalidRange] = useState(false)

  useEffect(
    () => setInvalidRange(!dateRange || !dateRange.from || !dateRange.to),
    [dateRange]
  )

  return (
    <header className="flex justify-between">
      <Button
        className="font-normal"
        size={'icon'}
        variant={'outline'}
        onClick={allOrders}
      >
        <FileStack />
      </Button>
      <Button
        className="font-normal"
        size={'icon'}
        variant={'outline'}
        onClick={() => queryOrderByStatus('pending')}
      >
        <FileClock />
      </Button>

      <div className="flex gap-2">
        <DatePicker date={date} setDate={setDate} />
        <Button onClick={queryOrdersByDate} size={'icon'} disabled={!date}>
          <Search size={20} />
        </Button>
      </div>

      <div className="flex gap-2">
        <DateRangePicker date={dateRange} setDate={setDateRange} />
        <Button
          onClick={queryOrdersByDateRange}
          size={'icon'}
          disabled={invalidRange}
        >
          <Search size={20} />
        </Button>
      </div>
    </header>
  )
}
