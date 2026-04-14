import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Ikuti pola resmi Supabase SSR: update KEDUA request & response cookies
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Step 1: Update request cookies (agar token refresh terbaca)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Step 2: Buat response baru dengan request yang sudah terupdate
          supabaseResponse = NextResponse.next({ request });
          // Step 3: Set cookies ke response untuk dikirim ke browser
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // PENTING: Gunakan getUser() bukan getSession() untuk keamanan server-side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proteksi route dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Proteksi route admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("[Middleware] Gagal ambil profile:", profileError.message);
      // Jika query gagal (RLS/DB error), jangan blok akses — biarkan page handle sendiri
      return supabaseResponse;
    }

    if (profile?.role !== "admin") {
      console.warn(
        `[Middleware] User ${user.id} role="${profile?.role}" bukan admin, redirect ke /dashboard`
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
