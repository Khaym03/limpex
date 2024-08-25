import MetricsProvider from "@/context/metrics-provider";
import MainChart from "./main-chart";


export default function Metrics() {
  return <MetricsProvider>
    <section className="container flex justify-center items-center h-screen">
    <MainChart/>
    </section>
  </MetricsProvider>
}
