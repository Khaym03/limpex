import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { SalesCtx } from '@/context/sales-provider'
import { addToShoppingCart } from '@/lib/utils'

export default function Measure() {
  const [bsInput, setBsInput] = useState(0)
  const [MlInput, setMlInput] = useState(0)

  const resetInputs = () => {
    setBsInput(0)
    setMlInput(0)
  }

  const {selectedProduct} = useContext(SalesCtx)

  const [disabled, setDisabled] = useState(!selectedProduct)

  useEffect(() => {
    resetInputs()
    setDisabled(!selectedProduct)
  }, [selectedProduct])

  

  const OnChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.id == 'bs') {
      setMlInput(0)
      setBsInput(Number(e.currentTarget.value))
    }

    if (e.currentTarget.id == 'ml') {
      setBsInput(0)
      setMlInput(Number(e.currentTarget.value))
    }
  }

  const calcHowMuchCanBuy = () => {
    if(!selectedProduct) return
    
    if(bsInput){
      const quantity = parseInt(((bsInput / selectedProduct.sale_price) * 1000 ).toString())
      addToShoppingCart(selectedProduct,quantity)
    }

    if(MlInput) {
      addToShoppingCart(selectedProduct,MlInput)
    }
  }


  return (
    <Card className="grid gap-3 w-full font-semibold">
      <CardHeader className="pb-0">
        <CardTitle className=" font-bold">Medidores</CardTitle>
        <CardDescription>Mide en funcion de Bs o Ml</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 py-0">
        <div className="grid gap-3 w-full">
          <Label htmlFor="bs">Ingrese Bs</Label>
          <Input
            id="bs"
            type="number"
            placeholder="Bolivares"
            onChange={OnChangeValue}
            value={bsInput ? bsInput : ''}
            disabled={disabled}
          />
        </div>

        <div className="grid gap-3 w-full">
          <Label htmlFor="ml">Ingrese Ml</Label>
          <Input
            id="ml"
            type="number"
            placeholder="Ml"
            onChange={OnChangeValue}
            value={MlInput ? MlInput : ''}
            disabled={disabled}
          />
        </div>
      </CardContent>

      <CardFooter className="border-t px-6 py-4">
        <Button disabled={disabled} className="w-full" onClick={calcHowMuchCanBuy}>Agregar</Button>
      </CardFooter>
    </Card>
  )
}
