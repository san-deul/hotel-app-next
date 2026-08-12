import { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "../supabase/client";


export interface MemberRow {
  id: string;
  role?: string;
  name?: string;
  [key: string]: unknown;
}
export type AppUser = User & MemberRow;


export const fetchMemberById = async (
  supabase: SupabaseClient,
  userId: string
): Promise<MemberRow | null> => {
  const { data, error } = await supabase
    .from("member")
    .select("id, role, name")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as MemberRow | null;
};


