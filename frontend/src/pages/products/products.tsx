import CurrencyDisplay from '@/components/currency-display'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductsProvider, { useProducts } from '@/context/products-provider'
import { CreateProductDialog } from '@/dialogs/create-cleaning-product'
import { DeleteProductDialog } from '@/dialogs/delete-cleaning-product'
import { UpdateProductDialog } from '@/dialogs/update-cleaning-product'
import { useCleaningProducts } from '@/hooks/produtc'
import { fadeInAnimationVariants } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { delay, motion } from 'framer-motion'
import { Box, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { domain } from 'wailsjs/go/models'

export default function Products() {
  const { products, uiUpdater } = useProducts()

  return (
    <section className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <Header />

      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <div className="grid gap-4 text-sm text-muted-foreground text-left">
          <CreateProductDialog callback={uiUpdater} />
          <DeleteProductDialog callback={uiUpdater} />
          <UpdateProductDialog callback={uiUpdater} />
        </div>

        <ul className="w-full grid grid-cols-2 auto-rows-min gap-3  px-3 py-2 overflow-hidden">
          {products.map((p, i) => (
            <motion.li
              key={p.id}
              variants={fadeInAnimationVariants}
              initial="initial"
              animate="animate"
              custom={i}
            >
              <ProductInfo product={p} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

interface ProductInfoProps {
  product?: domain.Product
}

function ProductInfo({ product }: ProductInfoProps) {
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
    <Card className="w-full overflow-hidden ">
      <CardHeader className="flex flex-col items-start px-4 py-3">
        <div className="flex items-center space-x-3">
          <Box className="h-6 w-6 text-primary" aria-hidden="true" />
          <CardTitle className="text-xl capitalize">{product.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 ">
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
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
            <span className="text-2xl font-semibold">
              <CurrencyDisplay amount={profit} />
            </span>
            <p className="text-sm text-zinc-600 font-medium mt-1">
              <span
                className={cn(
                  'inline-block  rounded-full px-2 py-0.5 text-black',
                  product.sale_price > product.purchase_price
                    ? 'bg-emerald-400'
                    : 'bg-red-400'
                )}
              >
                {profitPercentage}%
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Header() {
  return (
    <header>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Opciones</h1>
      </div>
    </header>
  )
}
