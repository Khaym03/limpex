import CurrencyDisplay from '@/components/currency-display'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCleaningProducts } from '@/hooks/produtc'
import { Box, TrendingUp } from 'lucide-react'
import { domain } from 'wailsjs/go/models'

export default function Products() {
  const { products } = useCleaningProducts()

  return (
    <section className="flex flex-col justify-center items-center h-screen overflow-hidden py-10">
      <div className="container flex flex-col justify-center items-center">
        <div className="grid grid-cols-2 lg:grid-cols-3 auto-rows-min gap-4 max-h-[564px] overflow-y-auto border">
         
          {products.map(p => (
            <ProductInfo key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface ProductInfoProps {
  product?: domain.Product
 
}

function ProductInfo({ product,  }: ProductInfoProps) {
  if (!product) {
    return (
    
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No hay información del producto disponible.
            </p>
          </CardContent>
        </Card>
      
    )
  }

  const profit = product.sale_price - product.purchase_price
  const profitPercentage = ((profit / product.purchase_price) * 100).toFixed(2)

  return (
  
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="flex flex-col items-start space-y-2 pb-6">
          <div className="flex items-center space-x-3">
            <Box className="h-6 w-6 text-primary" aria-hidden="true" />
            <CardTitle className="text-xl capitalize">{product.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 ">
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">
                Precio de Compra
              </dt>
              <dd>
                <CurrencyDisplay amount={product.purchase_price} />
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">
                Precio de Compra
              </dt>
              <dd>
                <CurrencyDisplay amount={product.sale_price} />
              </dd>
            </div>
          </div>

          <div className="flex flex-col rounded-lg">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <TrendingUp className="h-6 w-6" aria-hidden="true" />
              <span className="text-sm font-medium">Ganancia</span>
            </div>
            <div className="flex justify-between">
              <span className="text-2xl font-extrabold  text-black/80">
                <CurrencyDisplay amount={profit} />
              </span>
              <p className="text-sm text-zinc-600 font-medium mt-1">
                <span className="inline-block bg-green-400 text-zinc-800 rounded-full px-2 py-0.5">
                  +{profitPercentage}%
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
   
  )
}
