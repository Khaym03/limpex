import { useFadeIn } from "@/lib/animations"
import ListCostumers from "./list-costumers"
import PaymentMethod from "./payment-method"
import Preorder from "./pre-order"
import { animated } from "@react-spring/web"

export default function Checkout() {
  
  return (
    <animated.section style={{...useFadeIn()}} className="flex justify-center items-center h-screen  p-8">
      <div className="flex flex-row-reverse gap-4">
      <Preorder/>
      <section className="flex flex-col gap-4">
        <PaymentMethod/>
        <ListCostumers/>
      </section>
      </div>
    </animated.section>
  )
}
