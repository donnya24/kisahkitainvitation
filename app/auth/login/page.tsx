"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement Supabase login logic
    // const supabase = createClient();
    // const { error } = await supabase.auth.signInWithPassword({ email, password });

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4"
          >
            <span className="text-white font-bold text-2xl">K</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Selamat Datang Kembali
          </h2>
          <p className="text-gray-600 mt-2">Masuk ke akun KisahKita.id kamu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 rounded"
                />
                <span className="text-sm text-gray-600">Ingat saya</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-green-600 hover:text-green-700"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Atau</span>
            </div>
          </div>

          <Link
            href="/register"
            className="block text-center py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Daftar Akun Baru
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Dengan masuk, Anda menyetujui{" "}
          <Link href="/terms" className="text-green-600">
            Syarat & Ketentuan
          </Link>{" "}
          dan{" "}
          <Link href="/privacy" className="text-green-600">
            Kebijakan Privasi
          </Link>{" "}
          kami
        </p>
      </div>
    </div>
  );
}
