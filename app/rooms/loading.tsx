export default function RoomsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-32 bg-gray-200 rounded mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="w-full h-60 bg-gray-200 rounded" />
            <div className="mt-3 space-y-2">
              <div className="h-5 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}