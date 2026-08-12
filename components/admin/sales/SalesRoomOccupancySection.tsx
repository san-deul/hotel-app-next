import type { RoomOccupancy } from "@/lib/api/sales";
import SalesRoomOccupancyChart from "./SalesRoomOccupancyChart";

interface SalesRoomOccupancySectionProps {
  data: RoomOccupancy[];
}

const MAX_ROWS = 5;

export default function SalesRoomOccupancySection({ 
  data,
}: SalesRoomOccupancySectionProps) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, r) => sum + r.count, 0);

  const sortedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_ROWS);

  const emptyRows = MAX_ROWS - sortedData.length;

  return (
    <div className="bg-white rounded-lg p-4 shadow space-y-3">
      <h2 className="font-semibold mb-4">객실별 점유율</h2>

      <div className="grid grid-cols-2 gap-6">
        <SalesRoomOccupancyChart data={sortedData} />

        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left text-gray-500">
              <th className="py-2">객실</th>
              <th className="py-2 text-right">예약건수</th>
              <th className="py-2 text-right">비율</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((r) => {
              const percent = ((r.count / total) * 100).toFixed(1);
              return (
                <tr key={r.roomName} className="border-b last:border-0 h-12">
                  <td className="py-2">{r.roomName}</td>
                  <td className="py-2 text-right">{r.count}건</td>
                  <td className="py-2 text-right">{percent}%</td>
                </tr>
              );
            })}

            {Array.from({ length: emptyRows }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-12">
                <td colSpan={3}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}