// import { DatePicker } from '@/components/date-picker'
import { domain } from 'wailsjs/go/models'
import { ListOrders, ListOrdersByDate } from 'wailsjs/go/sales/Sales'
import DataTable from './data-table'
import { columns } from './columns'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getUserTimeZone } from '@/lib/utils'

export default function TodayInfo() {
  const [data, setData] = useState<domain.Order[]>([])

  const allOrders = async () => {
    setData(await ListOrders())
  }

  const todayOrders = async () => {
    const date = new Date()

    // date.setHours(date.getHours() - (date.getTimezoneOffset() / 60))
    // console.log(date.toISOString())
    const today: domain.DateArg = new domain.DateArg({
      date: date.toISOString(),
      client_time_zone: getUserTimeZone()
    })
    
    const data = await ListOrdersByDate(today)
  
    setData(data)
  }
  return (
    <section className="p-10">
      <header className='flex gap-2'>
        <Button variant={'outline'} onClick={allOrders}>
          todas las ordenes
        </Button>
        <Button variant={'outline'} onClick={todayOrders}>
          ordenes de hoy
        </Button>
      </header>
      <div className='mt-4 bg-white'>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  )
}
