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



export interface MemberProfile {
  id: string;
  name: string;
  phone: string;
  birth: string;
  zipcode: string;
  basic_address: string;
  detail_address: string | null;
}

export const fetchMemberProfileById = async (
  supabase: SupabaseClient,
  userId: string
): Promise<MemberProfile | null> => {
  const { data, error } = await supabase
    .from("member")
    .select("id, name, phone, birth, zipcode, basic_address, detail_address")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as MemberProfile | null;
};

export type UpdateMemberInput = Omit<MemberProfile, "id">;

export type UpdateMemberResult =
  | { ok: true }
  | { ok: false; message: string };

export const updateMemberProfile = async (
  supabase: SupabaseClient,
  userId: string,
  data: UpdateMemberInput
): Promise<UpdateMemberResult> => {
  const { error } = await supabase
    .from("member")
    .update(data)
    .eq("id", userId);

  if (error) {
    return { ok: false, message: error.message };
  }
  return { ok: true };
};
