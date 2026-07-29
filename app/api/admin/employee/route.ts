// app/api/admin/employee/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

// 호출자가 admin인지 확인하는 공통 함수
async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return { ok: false as const, res: NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 }) };
  }

  const { data: caller } = await supabase
    .from("member")
    .select("role")
    .eq("id", authUser.id)
    .single();

  if (caller?.role !== "admin") {
    return { ok: false as const, res: NextResponse.json({ success: false, message: "권한이 없습니다." }, { status: 403 }) };
  }

  return { ok: true as const };
}

// =======================
// POST: 직원 추가
// =======================
export async function POST(req: NextRequest) {
  const check = await requireAdmin();
  if (!check.ok) return check.res;

  const { name, phone, birth, email } = await req.json();

  if (!email || !name) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: "1111",
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user.id;

  const { error: memberError } = await supabaseAdmin.from("member").insert([
    { id: userId, name, email, phone, birth, role: "manager" },
  ]);

  if (memberError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: memberError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

// =======================
// DELETE: 직원 삭제 (auth 먼저, 성공해야 member 삭제)
// =======================
export async function DELETE(req: NextRequest) {
  const check = await requireAdmin();
  if (!check.ok) return check.res;

  const { userId } = await req.json();

  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY!
  );

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authError) {
    return NextResponse.json(
      {
        success: false,
        step: "auth",
        message: "Auth 계정 삭제 실패 — member 삭제도 진행하지 않음",
        error: authError.message,
      },
      { status: 400 }
    );
  }

  const { error: memberError } = await supabaseAdmin
    .from("member")
    .delete()
    .eq("id", userId);

  if (memberError) {
    return NextResponse.json(
      {
        success: false,
        step: "member",
        message: "member 삭제 실패 — Auth는 이미 삭제됨!",
        error: memberError.message,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, message: "Auth + member 삭제 완료" });
}