import ProductSlice from './product-slice'
import Measure from './measure'
import ShoppingCart from './shopping-cart'

export default function Selection() {
  return (
    <div className="flex flex-col gap-8 h-full p-8">
      <ProductSlice />
      <div className="flex gap-4 w-11/12 mx-auto flex-grow">
        <Measure /> <ShoppingCart />
      </div>
    </div>
  )
}
