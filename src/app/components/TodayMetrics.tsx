function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white p-4 shadow-sm">
      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-blue-400" />
      </div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

export default function TodayMetrics() {
  return (
    <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
      <div className="mb-3 text-base font-semibold text-gray-900">Today</div>
      <div className="grid grid-cols-3 gap-3">
        <Metric label="Kilometer" value="2.03" />
        <Metric label="minutes" value="15" />
        <Metric label="Calories" value="75" />
      </div>
    </div>
  );
}


