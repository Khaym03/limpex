import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CreateCostumerDialog } from '@/dialogs/create-costumer'
import { useContext, useEffect, useState } from 'react'
import { GetCustomers } from 'wailsjs/go/sales/Sales'
import { EventsOff, EventsOn } from 'wailsjs/runtime/runtime'
import { UserRound, Search } from 'lucide-react'
import { domain } from 'wailsjs/go/models'
import { SalesCtx } from '@/context/sales-provider'

interface ICostumerCard {
  costumer: domain.Customer
}

const CostumerCard = ({ costumer }: ICostumerCard) => {
  // save appends an order to a costumer
  const { save } = useContext(SalesCtx)
  
  return (
    <Button
      onClick={() => save(costumer.id)}
      size={'lg'}
      variant={'outline'}
      className="flex justify-start space-x-4 p-4 h-12 max-w-[186px] overflow-hidden  whitespace-nowrap"
    >
      <UserRound className="w-5 h-5" />
      <div className="flex flex-col gap-1 text-start">
        <p className="w-28 text-sm font-medium leading-none capitalize whitespace-nowrap overflow-hidden text-ellipsis">
          {costumer.name}
        </p>
        <p className="text-sm text-muted-foreground leading-none whitespace-normal">
          {costumer.ci ? costumer.ci : 'N/A'}
        </p>
      </div>
    </Button>

    // </div>
  )
}

export default function ListCostumers() {
  const [costumers, setCostumers] = useState<domain.Customer[]>([])

  useEffect(() => {
    GetCustomers().then(c => {
      c ? setCostumers(c) : setCostumers([])
    })
  }, [])

  useEffect(() => {
    const updateCostumers = async () => {
      setCostumers(await GetCustomers() ?? [])
    }

    EventsOn('update-costumers', updateCostumers)

    return () => {
      EventsOff('update-costumers')
    }
  }, [costumers])

  return (
    <Card className="h-full font-medium">
      <CardHeader className="flex flex-row justify-start space-y-0 gap-2">
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[336px] lg:w-[336px]"
          />
        </div>
        <CreateCostumerDialog />
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 overflow-y-auto h-[153px] max-h-[153px]">
        {costumers &&
          costumers.map(c => <CostumerCard key={c.id} costumer={c} />)}
      </CardContent>
    </Card>
  )
}
