import { useCleaningProducts } from '@/hooks/produtc'
import { createContext, useContext, useState } from 'react'

type ProductsCtxType = {
  changeDetector: boolean
  setChangeDetector: React.Dispatch<React.SetStateAction<boolean>>
  products: Product[]
  uiUpdater: () => void
}

const defaultValue: ProductsCtxType = {
  changeDetector: false,
  setChangeDetector: () => {},
  products: [],
  uiUpdater: () => {}
}

const ProductsCtx = createContext<ProductsCtxType>(defaultValue)

export default function ProductsProvider({ children }: any) {
  const [changeDetector, setChangeDetector] = useState(false)
  const { products } = useCleaningProducts([changeDetector])

  const uiUpdater = () => setChangeDetector(v => !v)

  return (
    <ProductsCtx.Provider
      value={{ changeDetector, setChangeDetector, products, uiUpdater }}
    >
      {children}
    </ProductsCtx.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsCtx)

  if (context === undefined)
    throw new Error('useProducts must be used within a ProductsProvider')

  return context
}
