import MetricsProvider from "@/context/metrics-provider";
import MainChart from "./main-chart";


export default function Metrics() {
  return <MetricsProvider>
    <section className="container">
    <MainChart/>
    </section>
  </MetricsProvider>
}
