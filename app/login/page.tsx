// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Baca parameter dari URL saat halaman dimuat
  useEffect(() => {
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    if (email) {
      setFormData((prev) => ({ ...prev, email: decodeURIComponent(email) }));
    }
    if (password) {
      setFormData((prev) => ({
        ...prev,
        password: decodeURIComponent(password),
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      console.log("Login sukses, user ID:", data.user.id);

      // Ambil role user dari database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      console.log("Role user:", profile?.role);

      // Redirect berdasarkan role
      if (profile?.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login gagal";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tighter text-navy inline-block"
          >
            KISAH<span className="text-gold">KITA</span>
          </Link>
          <h2 className="font-serif text-2xl mt-6 mb-2">
            Selamat Datang Kembali
          </h2>
          <p className="text-slate-500 text-sm">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gold text-white rounded-xl font-semibold hover:bg-amber-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">Atau</span>
            </div>
          </div>

          <Link
            href="/demo-login"
            className="w-full py-3 border-2 border-gold/30 text-gold rounded-xl font-semibold hover:bg-gold/10 transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Coba Demo Akun
          </Link>

          <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-gold font-semibold hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
