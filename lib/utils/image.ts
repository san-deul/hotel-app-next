export const getRoomImageUrl = (path?: string) => {
  if (!path) return "/images/no-image.jpg";
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/room_images/${path}`;
};