"use client";

import CarouselSection from "@/components/common/CarouselSection";
import { useRooms } from "@/hooks/useRooms";

export default function MainRooms() {
  const { data: rooms = [] } = useRooms();

  return (
    <div className="w-full">
      <CarouselSection title="객실 소개" items={rooms} />
    </div>
  );
}