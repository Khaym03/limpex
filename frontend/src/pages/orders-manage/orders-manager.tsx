import { useSpring, animated } from '@react-spring/web'
import OrdersMangerProvider from '@/context/orders-manager-provider'
import Content from './content'
import Header from './header'

export default function OrdersManger() {
  const fase = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 }
  })

  return (
    <OrdersMangerProvider>
      <animated.section
        style={{ ...fase }}
        className="flex items-center p-10 h-screen"
      >
        <div className="container max-w-5xl">
          <Header />
          <Content />
        </div>
      </animated.section>
    </OrdersMangerProvider>
  )
}
