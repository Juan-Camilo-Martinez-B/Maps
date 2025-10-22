export default function ActivityCard() {
  return (
    <div className="mt-4 rounded-2xl bg-gray-900 text-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17l-3 3 3-3zm0 0l3-3-3 3zm0 0V4m6 13l3 3-3-3zm0 0l-3-3 3 3zm0 0V4" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Running</div>
          <div className="text-xs text-gray-300">3000 meters per day</div>
        </div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-white/20">
        <div className="h-2 w-1/2 rounded-full bg-yellow-400" />
      </div>
    </div>
  );
}


