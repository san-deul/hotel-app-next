import { SupabaseClient, User } from "@supabase/supabase-js";
import { SignupFormValues } from "@/lib/schemas/signupSchema";

export type SignupResult =
  | { ok: true; user: User  }
  | { ok: false; message: string };

export const signUpWithMember = async (
  supabase: SupabaseClient,
  data: SignupFormValues
): Promise<SignupResult> => {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        phone: data.phone,
        zipcode: data.zipcode,
        basic_address: data.basic_address,
        detail_address: data.detail_address ?? "",
        birth: data.birth,
      },
    },
  });

  if (error || !authData.user) {
    return { ok: false, message: error?.message ?? "회원가입 중 오류가 발생했습니다." };
  }

  return { ok: true, user: authData.user };
};