import { useEffect, useState } from "react"
import { GetCleaningProducts } from "wailsjs/go/main/App"

export const useCleaningProducts = () => {
    const [products, setProducts] = useState<Product[]>([])
  
    useEffect(() => {
      GetCleaningProducts().then(p => setProducts(p))
    }, [])
  
    return {products}
  }