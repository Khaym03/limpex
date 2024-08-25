import { createContext, ReactNode, useEffect, useState } from 'react'
import { Dollar } from 'wailsjs/go/currency/currency'
import { domain } from 'wailsjs/go/models'

type CurrencyCtxType = {
  currency: Currency
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>
  toggleCurrency: () => void
  dollar: number
  setDollar: React.Dispatch<React.SetStateAction<number>>
}

const defaultValue: CurrencyCtxType = {
  currency: 'USD',
  setCurrency: () => {},
  toggleCurrency: () => {},
  dollar: 0,
  setDollar: () => {}
}

export const CurrencyCtx = createContext<CurrencyCtxType>(defaultValue)

interface CurrencyProviderProps {
  children: ReactNode
}

export default function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [dollar, setDollar] = useState(0)

  const toggleCurrency = () => {
    setCurrency((prevCurrency: Currency) =>
      prevCurrency === 'USD' ? 'VES' : 'USD'
    )
  
  }

  useEffect(() => {
    const fetchDollarValue = async () => {
      const dollarValue = await Dollar()
      setDollar(dollarValue)
    }

    fetchDollarValue()
  }, [])

  return (
    <CurrencyCtx.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        dollar,
        setDollar
      }}
    >
      {children}
    </CurrencyCtx.Provider>
  )
}
