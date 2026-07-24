"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useFavorite } from "@/hooks/useFavorite";

const supabase = createClient();

interface RoomRow {
  room_no: string | number;
  room_name: string;
  info?: string;
  price?: number;
  guest_count?: number;
  [key: string]: unknown;
}

interface RoomImageRow {
  room_img_no: string | number;
  room_no: string | number;
  upload_path: string;
  publicUrl: string;
  [key: string]: unknown;
}

export default function RoomDetailContent({ id }: { id: string }) {
  const router = useRouter();

  const [room, setRoom] = useState<RoomRow | null>(null);
  const [images, setImages] = useState<RoomImageRow[]>([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const roomNo = Number(id);


  useEffect(() => {
    const load = async () => {
      const { data: roomData, error: roomError } = await supabase
        .from("room")
        .select("*")
        .eq("room_no", id)
        .maybeSingle();

      if (roomError) {
        console.error("room fetch error:", roomError);
        setLoadError(roomError.message);
        return;
      }

      if (!roomData) {
        console.error("room not found for room_no:", id);
        setLoadError(`room_no=${id} 에 해당하는 객실을 찾지 못했습니다.`);
        return;
      }

      const { data: imgs, error: imgError } = await supabase
        .from("room_img")
        .select("*")
        .eq("room_no", id);

      if (imgError) {
        console.error("room_img fetch error:", imgError);
      }

      setRoom(roomData as RoomRow);

      if (imgs && imgs.length > 0) {
        const imageUrls = imgs.map((img) => {
          const { data } = supabase.storage
            .from("room_images")
            .getPublicUrl(img.upload_path);
          return {
            ...img,
            publicUrl: data.publicUrl,
          };
        });

        setImages(imageUrls as RoomImageRow[]);
      }
    };

    load();
  }, [id]);

  const {
    isFavorite,
    isLoading: favoriteLoading,
    toggleFavorite,
    isToggling,
  } = useFavorite(roomNo);

  if (loadError)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">{loadError}</div>
      </div>
    );

  if (!room)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );

  const showPrev = () => {
    setMainIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = () => {
    setMainIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* 제목 */}
      <h1 className="text-3xl font-serif mb-6">{room.room_name}</h1>

      {/* 메인 이미지 + 좌우 화살표 */}
      <div className="relative w-full h-[450px]">
        <img
          src={images[mainIndex]?.publicUrl}
          alt={room.room_name}
          className="w-full h-full object-cover rounded"
        />

        {/* 왼쪽 버튼 */}
        {images.length > 1 && (
          <button
            onClick={showPrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
          >
            <FiChevronLeft size={24} />
          </button>
        )}

        {/* 오른쪽 버튼 */}
        {images.length > 1 && (
          <button
            onClick={showNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
          >
            <FiChevronRight size={24} />
          </button>
        )}
      </div>

      {/* 썸네일 */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto">
          {images.map((img, index) => (
            <img
              key={img.room_img_no}
              src={img.publicUrl}
              alt={`${room.room_name} 썸네일 ${index + 1}`}
              onClick={() => setMainIndex(index)}
              className={`w-32 h-20 object-cover rounded cursor-pointer border-2 transition ${
                mainIndex === index
                  ? "border-[#6d563b]"
                  : "border-gray-300 hover:border-[#6d563b]"
              }`}
            />
          ))}
        </div>
      )}

      {/* 설명 */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">
          {room.info || "객실 설명이 준비 중입니다."}
        </h2>

        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <span className="font-semibold">가격:</span>{" "}
              {room.price?.toLocaleString() || "문의"}원
            </div>

            <div>
              <span className="font-semibold">기준 인원:</span>{" "}
              {room.guest_count || "-"}명
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="px-6 py-3 bg-[#6d563b] text-white rounded hover:bg-[#5a4730] transition"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/reserve/search`);
            }}
          >
            예약하기
          </button>
          <button
            onClick={toggleFavorite}
            disabled={favoriteLoading || isToggling}
            className={`px-6 py-3 rounded transition text-lg
                ${
                  isFavorite
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-200 hover:bg-gray-300"
                }
              `}
          >
            {isFavorite ? "♥ 찜" : "♡ 찜"}
          </button>
        </div>
      </div>
    </>
  );
}