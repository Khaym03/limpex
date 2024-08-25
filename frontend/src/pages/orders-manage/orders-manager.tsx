import OrdersMangerProvider from '@/context/orders-manager-provider'
import Content from './content'
import Header from './header'

export default function OrdersManger() {
  return (
    <OrdersMangerProvider>
      <section className="flex items-center p-10 h-screen">
        <div className="container max-w-5xl">
          <Header />
          <Content />
        </div>
      </section>
    </OrdersMangerProvider>
  )
}
