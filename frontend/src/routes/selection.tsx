import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { TbBottleFilled } from 'react-icons/tb'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { EventsEmit, EventsOn, EventsOnce } from 'wailsjs/runtime'
import { CreateCleaningProduct, GetCleaningProductById, GetCleaningProducts } from 'wailsjs/go/main/App'
import { useEffect, useState } from 'react'
import { useCleaningProducts } from '@/hooks/produtc'

const invoices = [
  {
    Id: 1,
    Quantity: 1000,
    TotalPrice: 34
  },
  {
    Id: 2,
    Quantity: 1000,
    TotalPrice: 34
  },
  {
    Id: 3,
    Quantity: 1000,
    TotalPrice: 34
  },
  {
    Id: 4,
    Quantity: 1000,
    TotalPrice: 34
  }
]

export function TableDemo() {
  return (
    <Card className="flex flex-grow px-3 py-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(invoice => (
            <TableRow key={invoice.Id}>
              <TableCell className="font-medium">{invoice.Id}</TableCell>
              <TableCell>{invoice.Quantity}</TableCell>
              <TableCell className="text-right">{invoice.TotalPrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  )
}


const Slice = () => {
  const {products} = useCleaningProducts()

  return (
    <Carousel
      opts={{
        align: 'start'
      }}
      className=" w-11/12 mx-auto"
    >
      <CarouselContent>
        {products && products.map((p) => (
          <CarouselItem key={p.Id} className="md:basis-1/2 lg:basis-1/5">
            <div className="p-1">
              <Card className="[&>*]:select-none relative aspect-[8/12] overflow-hidden flex flex-col gap-2">
                <div className="font-semibold top-0 w-full h-12 grid grid-cols-2 ">
                  {[500, 1000].map((quantity, i) => (
                    <div
                      key={i}
                      onClick={() => console.log('clicked')}
                      className={`grid place-items-center hover:bg-slate-50 transition-colors cursor-pointer`}
                    >
                      {`${quantity / 1000} Lt`}
                    </div>
                  ))}
                </div>

                <div className="flex flex-grow w-full justify-center items-center text-slate-700">
                  <TbBottleFilled size={'2rem'} />
                </div>

                <div className="text-center font-semibold px-3 py-2 flex flex-col">
                  <span>{p.Name}</span>
                  <span className="text-slate-500">{`${p.Price} $`}</span>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

const MeasureSection = () => {
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
      <Button onClick={removeFromCart} className="w-full">
        Remove
      </Button>
      <Button onClick={createProduct} className="w-full">
        create
      </Button>
    </Card>
  )
}

export default function Selection() {
  return (
    <div className="grid gap-8">
      <Slice />
      <div className="flex gap-4 w-11/12 mx-auto">
        <MeasureSection /> <TableDemo />
      </div>
    </div>
  )
}
