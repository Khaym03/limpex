import { useEffect, useState } from "react"
import { GetCleaningProducts } from "wailsjs/go/main/App"

export const useCleaningProducts = (dependencies?: any[]) => {
    const [products, setProducts] = useState<Product[]>([])
  
    useEffect(() => {
      GetCleaningProducts().then(p => setProducts(p))
    }, dependencies ? dependencies : [])
  
    return {products}
  }