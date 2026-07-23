import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface FacilityRow {
  id: number;
  name: string;
  [key: string]: unknown;
}

const fetchFacilities = async (): Promise<FacilityRow[]> => {
  const { data, error } = await supabase
    .from("facilities")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return data as FacilityRow[];
};

export const useFacilitiesQuery = () => {
  return useQuery({
    queryKey: ["facilities"],
    queryFn: fetchFacilities,
    staleTime: 1000 * 60 * 5, // 5분
  });
};