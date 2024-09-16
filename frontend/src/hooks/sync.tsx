import { useEffect, useState } from 'react'
import { GetCleaningProducts } from 'wailsjs/go/main/App'
import { domain } from 'wailsjs/go/models'

const API_URL = 'https://limpex-production.up.railway.app'

export function useSyncProducts() {
  const [products, setProducts] = useState<domain.Product[]>([])
  useEffect(() => {
    async function getProducts() {
      const products = await GetCleaningProducts()
      setProducts(products ?? [])
    }

    getProducts()
  }, [])

  async function syncProducts() {
    const response = await fetch(`${API_URL}/sync/products`, {
      method: 'POST',
      body: JSON.stringify(products),
    })

    if (response.ok) {
      console.log('Products synced successfully')
    } else {
      console.error('Failed to sync products')
    }
  }

  return { syncProducts }
}
