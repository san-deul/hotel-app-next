"use client";

import { useState } from "react";
import RoomTree from "./RoomTree";
import CategoryDetail from "./CategoryDetail";
import RoomDetail from "./RoomDetail";
import AddCategoryForm from "./AddCategoryForm";
import AddRoomForm from "./AddRoomForm";

import type { RoomRow } from "@/lib/api/room";
import { useRooms } from "@/hooks/queries/useRooms";

interface AdminRoomPageContentProps {
  initialRooms: RoomRow[];
}

export default function AdminRoomPageContent({ initialRooms }: AdminRoomPageContentProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomRow | null>(null);
  const { data: rooms } = useRooms(initialRooms);

  return (
    <div className="p-6">
      <div className="flex gap-6">
        <div className="w-1/3 bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-3">객실 목록</h2>
          <RoomTree data={rooms ?? []} onRoomSelect={(room) => setSelectedRoom(room)} />
        </div>

        <div className="flex-1 bg-white p-6 shadow rounded">
          {!selectedRoom && <div className="text-gray-500">객실을 선택해주세요.</div>}
          {selectedRoom?.depth === 0 && <CategoryDetail category={selectedRoom} />}
          {selectedRoom?.depth === 1 && (
            <RoomDetail key={selectedRoom.room_no} room={selectedRoom} />
          )}
        </div>
      </div>

      <AddCategoryForm />
      <AddRoomForm />
    </div>
  );
}