"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRooms } from "@/hooks/useRooms";
import { getRoomImageUrl } from "@/lib/api/roomApi";


export default function RoomsListContent() {

  const { data: rooms } = useRooms();

  if(!rooms) return null;

  const categories = rooms.filter((r) => r.depth === 0);
  const roomItems = rooms.filter((r) => r.depth === 1);;

  return (
    <>
      <h1 className="text-4xl font-serif mb-6">객실</h1>

      {categories.map((cat) => (
        <section key={cat.room_no} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{cat.room_name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            {roomItems
              .filter((d) => d.parent_no === String(cat.room_no))
              .map((room) => {
                const mainImg = room.room_img?.find((img) => img.is_main) ?? room.room_img?.[0];
                const imgUrl = mainImg
                  ? getRoomImageUrl(mainImg.upload_path)
                  : "/images/no-image.jpg";
                  //console.log('imgUrl',mainImg)

                  return (
                  <div key={room.room_no}>
                    <Link href={`/rooms/${room.room_no}`}>
                      <img
                        src={imgUrl}
                        className="w-full h-60 object-cover rounded"
                        alt={room.room_name}
                      />
                    </Link>

                    <div className="mt-3">
                      <h3 className="text-xl font-semibold">{room.room_name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{room.info as string}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
    </>
  );
}