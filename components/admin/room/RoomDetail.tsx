"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { RoomEditFormValues, roomEditSchema, roomSchema, type RoomFormValues } from "@/lib/schemas/roomSchema";
import { getRoomImageUrl } from "@/lib/utils/image";

import {
  useUploadRoomImage,
  useDeleteRoomImage,
  useSetMainRoomImage,
} from "@/hooks/mutations/useRoomImageActions";
import type { RoomRow, RoomImage } from "@/lib/api/room";
import { useRoomImages } from "@/hooks/mutations/useRoomImages";
import { useUpdateRoom } from "@/hooks/mutations/useUpdateRoom";

interface RoomDetailProps {
  room: RoomRow;
}

export default function RoomDetail({ room }: RoomDetailProps) {
  const [uploading, setUploading] = useState(false);

  const initialImages = [...(room.room_img ?? [])].sort(
    (a, b) => Number(b.is_main) - Number(a.is_main)
  );
  const { data: images } = useRoomImages(room.room_no, initialImages);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomEditFormValues>({
    resolver: yupResolver(roomEditSchema),
    defaultValues: {
      room_name: room.room_name,
      info: room.info,
      price: room.price,
      guest_count: room.guest_count,
      total_room: room.total_room as number | undefined,
    },
  });

  const updateMutation = useUpdateRoom(room.room_no);
  const uploadMutation = useUploadRoomImage(room.room_no);
  const deleteMutation = useDeleteRoomImage(room.room_no);
  const setMainMutation = useSetMainRoomImage(room.room_no);

  const onSubmit = (values: RoomFormValues) => {
    updateMutation.mutate(values, {
      onSuccess: () => alert("수정완료!"),
      onError: (err) => alert("수정 중 오류: " + err.message),
    });
  };

  const handleUpload = (file: File) => {
    setUploading(true);
    uploadMutation.mutate(file, {
      onSuccess: () => setUploading(false),
      onError: (err) => {
        alert(err.message === "STORAGE_UPLOAD_FAILED" ? "업로드 실패" : "DB Insert 실패");
        setUploading(false);
      },
    });
  };

  const handleDelete = (img: RoomImage) => {
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;
    deleteMutation.mutate(img);
  };

  const handleSetMain = (img: RoomImage) => {
    setMainMutation.mutate(img, {
      onError: () => alert("대표 이미지 설정 실패"),
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">객실 상세정보</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">객실명</label>
          <input className="border p-2 w-full" {...register("room_name")} />
          {errors.room_name && (
            <p className="text-red-500 text-sm">{errors.room_name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">객실설명</label>
          <textarea className="border p-2 w-full h-24" {...register("info")} />
        </div>

        <div>
          <label className="block font-semibold mb-1">가격</label>
          <input className="border p-2 w-full" {...register("price")} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">인원수</label>
          <input className="border p-2 w-full" {...register("guest_count")} />
          {errors.guest_count && (
            <p className="text-red-500 text-sm">{errors.guest_count.message}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">객실 수</label>
          <input className="border p-2 w-full" {...register("total_room")} />
          {errors.total_room && (
            <p className="text-red-500 text-sm">{errors.total_room.message}</p>
          )}
        </div>

        <button className="bg-[#696cff] text-white px-4 py-2 rounded">수정완료</button>
      </form>

      <h3 className="text-lg font-bold mt-8">이미지 목록</h3>

      <div className="flex gap-4 mt-3 flex-wrap">
        {images?.map((img) => (
          <div key={img.room_img_no} className="relative">
            <img
              src={getRoomImageUrl(img.upload_path)}
              alt={room.room_name}
              className={`w-32 h-32 object-cover border rounded ${
                img.is_main ? "ring-4 ring-[#696cff]" : ""
              }`}
            />
            {img.is_main ? (
              <span className="absolute bottom-1 left-1 bg-[#696cff] text-white text-xs px-2 rounded">
                대표 이미지
              </span>
            ) : (
              <button
                className="absolute bottom-1 right-1 bg-white text-xs px-2 rounded shadow"
                onClick={() => handleSetMain(img)}
              >
                대표로 설정
              </button>
            )}

            <button
              className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-sm px-2 rounded"
              onClick={() => handleDelete(img)}
            >
              X
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input
          type="file"
          id="upload-input"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />

        <button
          className="bg-[#696cff] text-white px-4 py-2 rounded"
          onClick={() => document.getElementById("upload-input")?.click()}
        >
          {uploading ? "업로드 중..." : "이미지 업로드"}
        </button>
      </div>
    </div>
  );
}