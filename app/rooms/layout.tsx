import RoomNav from "@/components/room/RoomNav";

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
      <RoomNav />
      <div className="flex-1 p-10">{children}</div>
    </div>
  );
}