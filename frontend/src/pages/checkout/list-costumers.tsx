import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SalesCtx } from '@/context/sales-provider'
import { CreateCostumerDialog } from '@/dialogs/create-costumer'
import { useCostumers } from '@/hooks/costumer'
import { useContext, useEffect, useState } from 'react'
import { GetCostumers } from 'wailsjs/go/sales/Sales'
import { EventsOff, EventsOn } from 'wailsjs/runtime/runtime'
import { UserRound, Search } from 'lucide-react'

interface ICostumerCard {
  costumer: Costumer
}

const CostumerCard = ({ costumer }: ICostumerCard) => {
  return (
    <Button size={'lg'} variant={'outline'}
      className="flex justify-start space-x-4 p-4 h-12 max-w-[186px] overflow-hidden  whitespace-nowrap"
    >
      <UserRound className='w-5 h-5' />
      <div className='flex flex-col gap-1 text-start'>
        <p className="w-28 text-sm font-medium leading-none capitalize whitespace-nowrap overflow-hidden text-ellipsis">
          {costumer.Name}
        </p>
        <p className="text-sm text-muted-foreground leading-none whitespace-normal">
          {costumer.CI ? costumer.CI : 'N/A'}
        </p>
      </div>
    </Button>

    // </div>
  )
}

export default function ListCostumers() {
  const [costumers, setCostumers] = useState<Costumer[]>([])

  useEffect(() => {
    GetCostumers().then(c => {
      c ? setCostumers(c) : setCostumers([])
    })
  }, [])

  useEffect(() => {
    const updateCostumers = async () => {
      const c = await GetCostumers()

      console.log(c, 'trigered')

      c ? setCostumers(c) : setCostumers([])
    }

    EventsOn('update-costumers', updateCostumers)

    return () => {
      EventsOff('update-costumers')
    }
  }, [costumers])

  return (
    <Card className='h-full font-medium'>
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
      <CardContent className="grid grid-cols-2 gap-2 overflow-y-auto">
        {costumers && costumers.map(c => <CostumerCard key={c.Id} costumer={c} />)}
      </CardContent>
    </Card>
  )
}