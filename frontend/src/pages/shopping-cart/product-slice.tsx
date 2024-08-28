import CurrencyDisplay from '@/components/currency-display'
import { Card } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { SalesCtx } from '@/context/sales-provider'
import { useCleaningProducts } from '@/hooks/produtc'
import { addToShoppingCart } from '@/lib/utils'
import { MouseEvent, useContext } from 'react'
import { Box } from 'lucide-react'
import { motion } from "framer-motion";

interface IQuanButton {
  product: Product
  quantity: number
}

function QuanButton({ product, quantity }: IQuanButton) {
  const clickHanler = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    addToShoppingCart(product, quantity)
  }
  return (
    <div
      onClick={clickHanler}
      className={`grid place-items-center transition-colors cursor-pointer`}
    >
      {`${quantity / 1000} Lt`}
    </div>
  )
}

export default function ProductSlice() {
  const { products } = useCleaningProducts()
  const { selectedProduct, setSelectedProduct } = useContext(SalesCtx)

  return (
    <Carousel
      opts={{
        align: 'start'
      }}
      className=" w-full mx-auto"
    >
      <CarouselContent className="px-2 py-3">
        {products &&
          products.map((p: Product) => (
            <CarouselItem
              key={p.id}
              className="md:basis-1/4 sm:basis-1/4 lg:basis-1/5"
            >
            
             <Card
                className={`[&>*]:select-none relative aspect-[2/3] overflow-hidden flex flex-col gap-2 cursor-pointer border-2  transition ${
                  selectedProduct?.id === p.id
                    ? 'border-primary dark:border-primary -translate-y-2'
                    : 'border-transparent'
                }`}
                onClick={() => {
                  if (selectedProduct?.id === p.id) setSelectedProduct(null)
                  else setSelectedProduct(p)
                }}
              >
                <div className="font-medium text-muted-foreground top-0 w-full h-12 grid grid-cols-2 ">
                  <QuanButton product={p} quantity={500} />
                  <QuanButton product={p} quantity={1000} />
                </div>

                <div className="flex flex-grow w-full justify-center items-center">
                  <Box className="transition" size={'2rem'} />
                </div>

                <div className="text-left px-6 py-4 flex flex-col">
                  <span className="font-medium capitalize text-base">
                    {p.name}
                  </span>
                  <span className="text-muted-foreground font-medium text-sm">
                    <CurrencyDisplay amount={p.sale_price} />
                  </span>
                </div>
              </Card>
            
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
