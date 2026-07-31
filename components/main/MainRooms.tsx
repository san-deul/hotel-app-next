import CarouselSection from "@/components/common/CarouselSection";
import { useRooms } from "@/hooks/useRooms";
import { fetchRooms } from "@/lib/api/roomApi";
import { createClient } from "@/lib/supabase/server";

export default async function MainRooms() {
  const supabase = await createClient();
  const rooms = await fetchRooms(supabase);

  const items = rooms.map((room) => ({
    id: room.room_no,
    title: room.room_name,
    image:
      room.room_img?.find((img) => img.is_main)?.upload_path
        ? supabase.storage
          .from("room_images")
          .getPublicUrl(
            room.room_img.find((img) => img.is_main)!.upload_path
          ).data.publicUrl
        : "/images/no-image.jpg",
  }));

  return (
    <div className="w-full">
      <CarouselSection title="객실 소개" items={items} />
    </div>
  );
}