// hooks/queries/useSalesSummary.ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchSalesSummary, SalesSummaryResult } from "@/lib/api/sales";

export const salesSummaryKey = (startDate: string, endDate: string) =>
  ["sales-summary", startDate, endDate] as const;

export function useSalesSummary(
  startDate: string,
  endDate: string,
  initialData?: SalesSummaryResult
) {
  const supabase = createClient();

  return useQuery({
    queryKey: salesSummaryKey(startDate, endDate),
    queryFn: () => fetchSalesSummary(supabase, startDate, endDate),
    initialData,
  });
}