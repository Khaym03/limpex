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
import { TbBottleFilled } from 'react-icons/tb'

interface IQuanButton {
  product: CleaningProduct
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
      className=" w-11/12 mx-auto"
    >
      <CarouselContent className="px-2 py-3">
        {products &&
          products.map(p => (
            <CarouselItem
              key={p.Id}
              className="md:basis-1/4 sm:basis-1/4 lg:basis-1/6"
            >
              <Card
                className={`[&>*]:select-none relative aspect-[8/12] overflow-hidden flex flex-col gap-2 cursor-pointer border-2  transition ${
                  selectedProduct?.Id === p.Id
                    ? 'border-black -translate-y-2'
                    : 'border-transparent'
                }`}
                onClick={() => {
                  if (selectedProduct?.Id === p.Id) setSelectedProduct(null)
                  else setSelectedProduct(p)
                }}
              >
                <div className="font-medium text-zinc-500 top-0 w-full h-12 grid grid-cols-2 ">
                  <QuanButton product={p} quantity={500} />
                  <QuanButton product={p} quantity={1000} />
                </div>

                <div className="flex flex-grow w-full justify-center items-center  text-black">
                  <TbBottleFilled className="transition" size={'2rem'} />
                </div>

                <div className="text-left px-6 py-4 flex flex-col">
                  <span className="text-black font-medium capitalize text-base">
                    {p.Name}
                  </span>
                  <span className="text-zinc-500 font-medium text-sm">{`${p.Price} $`}</span>
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
