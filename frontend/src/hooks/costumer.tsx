import { useEffect, useState } from 'react'
import { GetCostumerById, GetCostumers } from 'wailsjs/go/sales/Sales'
import { domain } from 'wailsjs/go/models'

export const useCostumers = () => {
  const [costumers, setCostumers] = useState<domain.Costumer[]>([])

  useEffect(() => {
    GetCostumers().then(p => setCostumers(p))
  }, [])

  return { costumers }
}

export function useCustomerDetails(id: number | undefined) {
  const [costumer, setCostumer] = useState<domain.Costumer | null>(null)

  useEffect(() => {
    if(!id) {
      setCostumer(null)
      return
    }
    const fetchCostumer = async () => {
      setCostumer(await GetCostumerById(id))
    }

    fetchCostumer()
  },[id])

  return {costumer}
}
