"use client";

import { useQuery } from "@tanstack/react-query";
import CarouselSection from "@/components/common/CarouselSection";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface FacilityImage {
  upload_path: string;
  is_main: boolean;
}

interface FacilityRow {
  id: number;
  name: string;
  facility_img: FacilityImage[] | null;
}

export default function MainFacilities() {
  const getFacilityImage = (path?: string) => {
    if (!path) return "/images/no-image.jpg";

    const { data } = supabase.storage.from("facility_images").getPublicUrl(path);

    return data.publicUrl;
  };

  const { data: facilities = [] } = useQuery({
    queryKey: ["facility-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select(
          `
          id,
          name,
          facility_img (
            upload_path,
            is_main
          )
        `
        )
        .order("id");

      if (error) throw error;

      return (data as FacilityRow[]).map((facility) => {
        const mainImg = facility.facility_img?.find((img) => img.is_main);

        return {
          id: facility.id,
          title: facility.name,
          image: mainImg
            ? getFacilityImage(mainImg.upload_path)
            : "/images/no-image.jpg",
        };
      });
    },
  });

  return (
    <div className="w-full">
      <CarouselSection title="부대시설 안내" items={facilities} />
    </div>
  );
}