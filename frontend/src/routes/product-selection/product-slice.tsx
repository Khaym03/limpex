import { Card } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { useCleaningProducts } from '@/hooks/produtc'
import { TbBottleFilled } from 'react-icons/tb'

export default function ProductSlice() {
  const { products } = useCleaningProducts()

  return (
    <Carousel
      opts={{
        align: 'start'
      }}
      className=" w-11/12 mx-auto"
    >
      <CarouselContent>
        {products &&
          products.map(p => (
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
