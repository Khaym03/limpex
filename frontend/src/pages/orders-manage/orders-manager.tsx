import OrdersMangerProvider from '@/context/orders-manager-provider'
import Content from './content'
import Header from './header'

export default function OrdersManger() {
  return (
    <OrdersMangerProvider>
      <section className="flex items-center h-screen p-4 md:gap-8 md:p-10">
        <div className="container max-w-6xl">
          <Header />
          <Content />
        </div>
      </section>
    </OrdersMangerProvider>
  )
}
