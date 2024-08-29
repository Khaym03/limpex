import MetricsProvider from '@/context/metrics-provider'
import MainChart from './main-chart'
import Profit from './profit'
import AverageSalesPerDay from './average-sales-per-day'

export default function Metrics() {
  return (
    <MetricsProvider>
      <section className="container flex justify-center items-center h-screen">
        <div className="container flex flex-col gap-8 justify-center items-center max-w-6xl">
          <MainChart />
          <div className="grid grid-cols-2 gap-8 w-full">
            <Profit />
            <AverageSalesPerDay/>
          </div>
        </div>
      </section>
    </MetricsProvider>
  )
}
