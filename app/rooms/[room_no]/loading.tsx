export default function RoomDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-1/3 bg-gray-200 rounded mb-6" />

      <div className="w-full h-[450px] bg-gray-200 rounded" />

      <div className="mt-10 space-y-4">
        <div className="h-6 w-2/3 bg-gray-200 rounded" />
        <div className="h-32 w-full bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}