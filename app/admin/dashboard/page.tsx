// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalInvitations: number;
  totalTemplates: number;
  totalTransactions: number;
  totalRevenue: number;
  activeInvitations: number;
  totalGuests: number;
  totalRsvp: number;
}

interface RecentUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface RecentTransaction {
  id: string;
  user_email: string;
  amount: number;
  payment_status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalInvitations: 0,
    totalTemplates: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    activeInvitations: 0,
    totalGuests: 0,
    totalRsvp: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    RecentTransaction[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function fetchAdminData() {
      // Get current admin
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Get admin profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      setAdminName(profile?.full_name || "Admin");

      // Get stats
      const [
        { count: totalUsers },
        { count: totalAdmins },
        { count: totalInvitations },
        { count: totalTemplates },
        { count: totalTransactions },
        { data: transactions },
        { count: activeInvitations },
        { count: totalGuests },
        { count: totalRsvp },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "user"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin"),
        supabase.from("invitations").select("*", { count: "exact", head: true }),
        supabase.from("templates").select("*", { count: "exact", head: true }),
        supabase.from("transactions").select("*", { count: "exact", head: true }),
        supabase.from("transactions").select("amount"),
        supabase
          .from("invitations")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase.from("guests").select("*", { count: "exact", head: true }),
        supabase.from("rsvp").select("*", { count: "exact", head: true }),
      ]);

      const totalRevenue =
        transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalAdmins: totalAdmins || 0,
        totalInvitations: totalInvitations || 0,
        totalTemplates: totalTemplates || 0,
        totalTransactions: totalTransactions || 0,
        totalRevenue,
        activeInvitations: activeInvitations || 0,
        totalGuests: totalGuests || 0,
        totalRsvp: totalRsvp || 0,
      });

      // Get recent users (hanya role 'user', bukan admin)
      const { data: users } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, created_at")
        .eq("role", "user")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentUsers(users || []);

      // Get recent transactions
      const { data: txns } = await supabase
        .from("transactions")
        .select(
          `
          id,
          amount,
          payment_status,
          created_at,
          profiles (email)
        `,
        )
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentTransactions(
        txns?.map((t) => ({
          ...t,
          user_email: (t.profiles as { email?: string } | null)?.email ?? '',
        })) || [],
      );

      setIsLoading(false);
    }

    fetchAdminData();
  }, [router]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500">Memuat dashboard admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-slate-900 text-white p-6 sticky top-0">
        <div className="text-xl font-bold mb-10 text-amber-400">KISAHKITA</div>
        <div className="mb-6 pb-6 border-b border-slate-700">
          <p className="text-xs text-slate-400">Admin</p>
          <p className="font-semibold">{adminName}</p>
        </div>
        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border-l-4 border-amber-500 text-amber-400"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Pengguna
          </Link>
          <Link
            href="/admin/templates"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Template
          </Link>
          <Link
            href="/admin/invitations"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
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
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19h18"
              />
            </svg>
            Undangan
          </Link>
          <Link
            href="/admin/transactions"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Transaksi
          </Link>
          <Link
            href="/admin/promotions"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
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
                d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
              />
            </svg>
            Promosi
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Pengaturan
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="flex items-center gap-3 p-3 w-full hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-red-400"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">Selamat datang, {adminName}</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Pengguna</p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Undangan</p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.totalInvitations}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19h18"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-green-600">
                Aktif: {stats.activeInvitations}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Transaksi</p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.totalTransactions}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-500">
                Pendapatan: Rp {stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Template</p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.totalTemplates}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-500 text-sm mb-1">Total Tamu</p>
            <p className="text-2xl font-bold text-slate-800">
              {stats.totalGuests.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-500 text-sm mb-1">Total RSVP</p>
            <p className="text-2xl font-bold text-slate-800">
              {stats.totalRsvp.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-500 text-sm mb-1">Admin</p>
            <p className="text-2xl font-bold text-slate-800">
              {stats.totalAdmins}
            </p>
          </div>
        </div>

        {/* Recent Users & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                Pengguna Terbaru
              </h2>
              <Link
                href="/admin/users"
                className="text-amber-600 text-sm hover:underline"
              >
                Lihat semua →
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {user.full_name || user.email}
                    </p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.role}
                    </span>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-slate-400 hover:text-amber-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  Belum ada pengguna
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                Transaksi Terbaru
              </h2>
              <Link
                href="/admin/transactions"
                className="text-amber-600 text-sm hover:underline"
              >
                Lihat semua →
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {tx.user_email || "User"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Rp {tx.amount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tx.payment_status === "paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {tx.payment_status === "paid" ? "Lunas" : "Pending"}
                    </span>
                    <Link
                      href={`/admin/transactions/${tx.id}`}
                      className="text-slate-400 hover:text-amber-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  Belum ada transaksi
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
