// components/reserve/ReservationSummary.tsx
import Image from "next/image";
import type { RoomRow } from "@/lib/api/room";

interface SearchInfo {
  start: string;
  end: string;
  adult: number;
  child: number;
}

interface Props {
  room: RoomRow;
  imageUrl: string;
  searchInfo: SearchInfo;
}

export default function ReservationSummary({ room, imageUrl, searchInfo }: Props) {
  return (
    <aside
      className="
        w-full lg:w-80
        bg-white border rounded-xl p-5 shadow
        h-fit
        static lg:sticky lg:top-10
        order-first lg:order-last"
    >
      <div className="relative w-full h-40 mb-4 overflow-hidden rounded">
        <Image src={imageUrl} alt={room.room_name} fill className="object-cover" />
      </div>

      <h3 className="text-xl font-semibold mb-2">{room.room_name}</h3>
      <p className="text-sm text-gray-600 mb-4">
        {searchInfo.start} ~ {searchInfo.end} <br />
        성인 {searchInfo.adult} / 아동 {searchInfo.child}
      </p>

      <hr className="my-4" />

      <div className="flex justify-between text-lg font-bold">
        <span>총 결제금액</span>
        <span>{room.price?.toLocaleString()}원</span>
      </div>
    </aside>
  );
}