"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface RoomRow {
  room_no: string | number;
  room_name: string;
  depth: number;
  parent_name: string;
  info?: string;
  [key: string]: unknown;
}

interface RoomImageRow {
  room_no: string | number;
  upload_path: string;
  [key: string]: unknown;
}

export default function RoomsListContent() {
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [images, setImages] = useState<RoomImageRow[]>([]);

  useEffect(() => {
    const load = async () => {
      // 1) 객실 정보 조회
      const { data: roomData } = await supabase
        .from("room")
        .select("*")
        .order("room_no");

      // 2) 이미지 정보 조회
      const { data: imgData } = await supabase.from("room_img").select("*");

      setRooms((roomData as RoomRow[]) ?? []);
      setImages((imgData as RoomImageRow[]) ?? []);
    };

    load();
  }, []);

  // depth = 0: 카테고리, depth = 1: 실제 객실
  const categories = rooms.filter((r) => r.depth === 0);
  const roomItems = rooms.filter((r) => r.depth === 1);

  // ================================
  // ⭐ room_no 기준 대표 이미지 URL 가져오기
  // ================================
  const getRoomImage = (room_no: string | number) => {
    const img = images.find((i) => i.room_no === room_no);
    if (!img) return "https://via.placeholder.com/600x400";

    // supabase Public URL 변환
    const { data } = supabase.storage
      .from("room_images")
      .getPublicUrl(img.upload_path);

    return data.publicUrl;
  };

  return (
    <>
      <h1 className="text-4xl font-serif mb-6">객실</h1>

      {categories.map((cat) => (
        <section key={cat.room_no} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{cat.room_name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            {roomItems
              .filter((d) => d.parent_name === String(cat.room_no))
              .map((room) => (
                <div key={room.room_no}>
                  <Link href={`/rooms/${room.room_no}`}>
                    <img
                      src={getRoomImage(room.room_no)}
                      className="w-full h-60 object-cover rounded"
                      alt={room.room_name}
                    />
                  </Link>

                  <div className="mt-3">
                    <h3 className="text-xl font-semibold">
                      {room.room_name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">{room.info}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}