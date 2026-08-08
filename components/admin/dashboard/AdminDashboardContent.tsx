import Link from "next/link";

interface ReservationRow {
  id: string | number;
  guest_name: string;
  guest_phone: string;
  room: { room_name: string } | null;
}

interface Props {
  todayStr: string;
  hasError: boolean;
  summary: { checkin: number; checkout: number; confirmed: number; pending: number; cancelled: number };
  checkinList: ReservationRow[];
  checkoutList: ReservationRow[];
}

export default function AdminDashboardContent({ todayStr, hasError, summary, checkinList, checkoutList }: Props) {
  const todayLabel = new Date(todayStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <section className="bg-white rounded-xl shadow py-8">
        <div className="text-center mb-6">
          <p className="text-sm text-blue-500 font-medium">Today</p>
          <h2 className="text-2xl font-bold">{todayLabel}</h2>
        </div>
        <div className="grid grid-cols-5 divide-x">
          <SummaryItem label="오늘 입실" value={summary.checkin} />
          <SummaryItem label="오늘 퇴실" value={summary.checkout} />
          <SummaryItem label="예약 완료" value={summary.confirmed} />
          <SummaryItem label="예약 대기" value={summary.pending} />
          <SummaryItem label="예약 취소" value={summary.cancelled} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayTable title="오늘 입실" rows={checkinList} emptyText="오늘 입실 예정이 없습니다." moreHref={`/admin/reserve/condition?type=checkin&date=${todayStr}`} timeLabel="15:00" />
        <TodayTable title="오늘 퇴실" rows={checkoutList} emptyText="오늘 퇴실 예정이 없습니다." moreHref={`/admin/reserve/condition?type=checkout&date=${todayStr}`} timeLabel="11:00" />
      </section>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className={`text-4xl font-bold ${value === 0 ? "text-gray-300" : "text-gray-800"}`}>{value}</p>
      <p className="mt-2 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function TodayTable({ title, rows, emptyText, moreHref, timeLabel }: { title: string; rows: ReservationRow[]; emptyText: string; moreHref: string; timeLabel: string }) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h3 className="font-semibold">{title}</h3>
        <Link href={moreHref} className="text-sm text-blue-500 hover:underline">더보기 &gt;</Link>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="py-2 px-3 text-left">시간</th>
            <th className="py-2 px-3 text-left">객실명</th>
            <th className="py-2 px-3 text-left">예약자</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={3} className="py-6 text-center text-gray-400">{emptyText}</td></tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="py-3 px-3">{timeLabel}</td>
              <td className="py-3 px-3">{row.room?.room_name || "-"}</td>
              <td className="py-3 px-3">
                <div>{row.guest_name}</div>
                <div className="text-xs text-gray-400">{row.guest_phone}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}