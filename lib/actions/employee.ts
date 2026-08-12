"use server";

import { createClient as createServiceClient, SupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerSupabase } from "@/lib/supabase/server";



async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    throw new Error("인증이 필요합니다.");
  }

  const { data: caller, error } = await supabase
    .from("member")
    .select("role")
    .eq("id", authUser.id)
    .single();

  if (error) {
    throw new Error("권한 확인 중 오류가 발생했습니다.");
  }

  if (caller?.role !== "admin") {
    throw new Error("권한이 없습니다.");
  }
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase 환경변수가 없습니다.");
  }
  return createServiceClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  /*
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  */
}

function generateTempPassword() {

  return crypto.randomUUID().split("-").slice(0, 2).join("-");
}

// ---- Server Actions ----

export type AddEmployeeInput = {
  name: string;
  phone: string;
  birth: string;
  email: string;
};

export async function addEmployee(form: AddEmployeeInput) {

  await requireAdmin();

  if (!form.email || !form.name) {
    throw new Error("필수 항목이 누락되었습니다.");
  }

  const supabaseAdmin = createAdminClient();

  const tempPassword = generateTempPassword();

  const { data: usersData, error: usersError } =
    await supabaseAdmin.auth.admin.listUsers();

  if (usersError) {
    throw new Error(`listUsers 실패: ${usersError.message}`);
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: form.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: form.name,
        phone: form.phone,
        birth: form.birth,
      },
    });

  if (authError) {
    throw new Error(
      authError.message || "계정 생성에 실패했습니다."
    );
  }

  const userId = authData.user.id;

  const { error: memberError } = await supabaseAdmin
    .from("member")
    .update({ role: "manager" })
    .eq("id", userId);

  if (memberError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    throw new Error(memberError.message);
  }

  return {
    email: form.email,
    tempPassword,
  };
}

export async function deleteEmployee(userId: string) {
  await requireAdmin();

  const supabaseAdmin = createAdminClient();

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authError) {
    throw new Error(`Auth 계정 삭제 실패 — member 삭제도 진행하지 않음: ${authError.message}`);
  }

  const { error: memberError } = await supabaseAdmin.from("member").delete().eq("id", userId);
  if (memberError) {
    throw new Error(`member 삭제 실패 — Auth는 이미 삭제됨! ${memberError.message}`);
  }

  return { success: true };
}


export type UpdateEmployeeInput = {
  name: string;
  phone: string;
  birth: string;
};

export async function updateEmployee(userId: string, form: UpdateEmployeeInput) {
  await requireAdmin();

  if (!form.name || !form.phone) {
    throw new Error("필수 항목이 누락되었습니다.");
  }

  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin
    .from("member")
    .update({
      name: form.name,
      phone: form.phone,
      birth: form.birth,
    })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}


export interface EmployeeDetail {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  birth: string | null;
}

export async function fetchEmployeeById(
  supabase: SupabaseClient,
  id: string
): Promise<EmployeeDetail | null> {
  const { data, error } = await supabase
    .from("member")
    .select("id, name, phone, email, birth")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as EmployeeDetail;
}