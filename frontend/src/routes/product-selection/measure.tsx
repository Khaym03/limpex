import { EventsEmit, EventsOn, EventsOnce } from 'wailsjs/runtime'
import { CreateCleaningProduct, GetCleaningProductById, GetCleaningProducts } from 'wailsjs/go/main/App'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Measure() {
    EventsOnce('eco', d => {
      console.log(d)
    })
    const addToCart = () => {
      const orderItem = {
        Id: 1,
        Quantity: 1000,
        TotalPrice: 34
      }
      EventsEmit('add-to-cart', orderItem)
    }
  
    const removeFromCart = () => {
      EventsEmit('remove-from-cart', { Id: 1 })
    }
  
    const createProduct = () => {
      CreateCleaningProduct('lavaplatos', 0.78, 'red')
    }
  
    const getCPById = () => {
      GetCleaningProductById(6).then(cp => console.log(cp))
    }
  
    return (
      <Card className="flex flex-col p-4 gap-4">
        <div className="w-full max-w-sm flex items-center gap-4 ">
          <div className="flex flex-col">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
              Ingrese Bs
            </label>
            <Input id="bs" type="text" placeholder="Bolivares" />
          </div>
  
          <div className="flex flex-col">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
              Ingrese Ml
            </label>
            <Input id="ml" type="text" placeholder="Ml" />
          </div>
        </div>
  
        <Button
          onClick={getCPById}
          className="w-full"
        >
          get
        </Button>
      </Card>
    )
  }