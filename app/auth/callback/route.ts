// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Ambil user setelah login
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let redirectPath = "/dashboard"; // default user

  if (user) {
    // Cek role user dari database
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Jika admin, redirect ke admin dashboard
    if (profile?.role === "admin") {
      redirectPath = "/admin/dashboard";
    }
  }

  // Redirect berdasarkan role
  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}
