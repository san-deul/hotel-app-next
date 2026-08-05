import type { SupabaseClient } from "@supabase/supabase-js";

export interface FacilityImage {
  facility_img_no: string | number;
  upload_path: string;
  is_main: boolean;
  [key: string]: unknown;
}

export interface FacilityRow {
  id: number;
  name: string;
  facility_img: FacilityImage[] | null;
  [key: string]: unknown;
}

export const getFacilityImageUrl = (supabase: SupabaseClient, path?: string) => {
  if (!path) return "/images/no-image.jpg";

  const { data } = supabase.storage.from("facility_images").getPublicUrl(path);

  return data.publicUrl;
};

export const fetchFacilities = async (
  supabase: SupabaseClient
): Promise<FacilityRow[]> => {
  const { data, error } = await supabase
    .from("facilities")
    .select(`id, name, facility_img (upload_path, is_main)`)
    .order("id");

  if (error) throw error;
  return data as FacilityRow[];
};

export interface MainFacilityCarouselItem {
  id: string | number;
  title: string;
  image: string;
}

export const fetchFacilitiesForMain = async (
  supabase: SupabaseClient
): Promise<MainFacilityCarouselItem[]> => {
  const facilities = await fetchFacilities(supabase);

  return facilities.map((facility) => {
    const mainImagePath = facility.facility_img?.find((img) => img.is_main)?.upload_path;

    return {
      id: facility.id,
      title: facility.name,
      image: getFacilityImageUrl(supabase, mainImagePath),
    };
  });
};