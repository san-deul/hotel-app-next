import RoomDetailContent from "@/components/room/RoomDetailContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "객실 상세 | SD HOTEL",
  description: "SD HOTEL & Suites 객실 상세 정보입니다.",
};

interface RoomDetailPageProps {
  params: Promise<{ room_no: string }>;
}

export default async function RoomDetailPage({
  params,
}: RoomDetailPageProps) {
  const { room_no } = await params;

  return <RoomDetailContent id={room_no} />;
}