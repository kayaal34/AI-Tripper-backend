import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RouteForm from "./components/RouteForm";
import PlaceList from "./components/PlaceList";
import MapView from "./components/MapView";
import RouteSummaryCard from "./components/RouteSummaryCard";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[360px_1fr]">
          <section className="space-y-6">
            <RouteForm />
            <PlaceList />
          </section>
          <section className="relative rounded-3xl bg-white shadow-2xl">
            <MapView />
            <RouteSummaryCard className="absolute top-6 right-6" />
          </section>
        </div>
      </div>
    </QueryClientProvider>
  );
}
