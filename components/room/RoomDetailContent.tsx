"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useFavorite } from "@/hooks/useFavorite";
import { getRoomImageUrl } from "@/lib/utils/image";
import type { RoomRow } from "@/lib/api/room";

interface RoomDetailContentProps {
  room: RoomRow;
}

export default function RoomDetailContent({ room }: RoomDetailContentProps) {
  const router = useRouter();
  const roomNo = Number(room.room_no);

  const [mainIndex, setMainIndex] = useState(0);
  const images = room.room_img ?? [];

  const {
    isFavorite,
    isLoading: favoriteLoading,
    toggleFavorite,
    isToggling,
  } = useFavorite(roomNo);

  const showPrev = () => {
    setMainIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = () => {
    setMainIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <h1 className="text-3xl font-serif mb-6">{room.room_name}</h1>

      <div className="relative w-full h-[450px]">
        <img
          src={getRoomImageUrl(images[mainIndex]?.upload_path)}
          alt={room.room_name}
          className="w-full h-full object-cover rounded"
        />

        {images.length > 1 && (
          <button
            onClick={showPrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
          >
            <FiChevronLeft size={24} />
          </button>
        )}

        {images.length > 1 && (
          <button
            onClick={showNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
          >
            <FiChevronRight size={24} />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto">
          {images.map((img, index) => (
            <img
              key={img.room_img_no}
              src={getRoomImageUrl(img.upload_path)}
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
            onClick={() => toggleFavorite()}
            disabled={favoriteLoading || isToggling}
            className={`px-6 py-3 rounded transition text-lg ${
              isFavorite
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {isFavorite ? "♥ 찜" : "♡ 찜"}
          </button>
        </div>
      </div>
    </>
  );
}