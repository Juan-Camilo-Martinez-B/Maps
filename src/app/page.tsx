import ActivityCard from "./components/ActivityCard";
import Card from "./components/Card";
import MapClient from "./components/MapClient";
import MapControls from "./components/MapControls";
import TodayMetrics from "./components/TodayMetrics";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-yellow-100 to-yellow-200 flex items-center justify-center py-10">
      <Card>
        <div className="grid gap-4">
          <MapControls />
          <MapClient />
          <ActivityCard />
          <TodayMetrics />
        </div>
      </Card>
    </div>
  );
}
