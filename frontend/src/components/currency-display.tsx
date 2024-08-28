import { CurrencyCtx } from "@/context/currency-provider"
import { useContext, useEffect, useState } from "react"
import { Dollar } from "wailsjs/go/currency/currency";

export function formatCurrency(amount: number, currency: string) {
    const [dollar, setDollar] = useState(0)


    useEffect(() => {
        (async() => {
            console.log(await Dollar())
            setDollar(await Dollar())
        })
    },[currency])

    return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: currency
    }).format(currency === 'VES' ? amount * dollar : amount);
}

interface CurrencyDisplayProps extends React.HTMLAttributes<HTMLDivElement>  {
    amount: number
}

export default function CurrencyDisplay({ amount, ...props }:CurrencyDisplayProps) {
  const { currency } = useContext(CurrencyCtx)

  const [dollar, setDollar] = useState<number>(0); 

  useEffect(() => {
      const fetchDollarValue = async () => {
          try {
              const dollarValue = await Dollar();
              setDollar(dollarValue);
          } catch (error) {
              console.error('Error al obtener el valor del dólar:', error);
              setDollar(0); // O maneja el error según tus necesidades
          }
      };

      fetchDollarValue();
  }, [currency]);


  // Formatear el valor
  const formattedAmount = new Intl.NumberFormat('en-EN', {
      style: 'currency',
      currency: currency
  }).format(currency === 'VES' ? amount * dollar : amount);


  return <div {...props}>{formattedAmount}</div>;
}
