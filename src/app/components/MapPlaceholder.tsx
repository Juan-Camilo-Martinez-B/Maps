export default function MapPlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-100">
      <div className="aspect-9/12 w-full" />
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="border border-gray-300" />
        ))}
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 shadow">2.03 Km</div>
      </div>
    </div>
  );
}


