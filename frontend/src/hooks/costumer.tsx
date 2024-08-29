import { useEffect, useState } from 'react'
import { GetCustomerById, GetCustomers } from 'wailsjs/go/sales/Sales'
import { domain } from 'wailsjs/go/models'

export const useCustomers = () => {
  const [costumers, setCostumers] = useState<domain.Customer[]>([])

  useEffect(() => {
    GetCustomers().then(p => setCostumers(p ?? []))
  }, [])

  return { costumers }
}

export function useCustomerDetails(id: number | undefined) {
  const [costumer, setCostumer] = useState<domain.Customer | null>(null)

  useEffect(() => {
    if(!id) {
      setCostumer(null)
      return
    }
    const fetchCostumer = async () => {
      setCostumer(await GetCustomerById(id))
    }

    fetchCostumer()
  },[id])

  return {costumer}
}
