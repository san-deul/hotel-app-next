import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export interface EmployeeRow {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  role: string;
  created_at: string;
}

export const fetchEmployees = cache(async (
  supabase: SupabaseClient
): Promise<EmployeeRow[]> => {
  const { data, error } = await supabase
    .from("member")
    .select("id, name, phone, email, role, created_at")
    .eq("role", "manager");

  if (error) throw error;
  return data as EmployeeRow[];
});

export async function generateNextManagerEmail(
  supabase: SupabaseClient
): Promise<string> {
  const { data: managers, error } = await supabase
    .from("member")
    .select("email")
    .eq("role", "manager");

  if (error) throw error;

  let maxNumber = 0;
  managers?.forEach((m) => {
    const match = m.email?.match(/^manager(\d+)@test\.com$/);
    if (match) {
      const num = parseInt(match[1]);
      if (num > maxNumber) maxNumber = num;
    }
  });

  return `manager${maxNumber + 1}@test.com`;
}