export default function HeaderBar() {
  return (
    <div className="flex items-center justify-between">
      <button className="h-8 w-8 rounded-full bg-white shadow flex items-center justify-center">
        <span className="sr-only">Back</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="h-2 w-16 rounded-full bg-gray-200" />
    </div>
  );
}


