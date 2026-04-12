// app/dashboard/guests/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Guest {
  id: string;
  name: string;
  phone: string;
  unique_link_code: string;
  is_sent: boolean;
  created_at: string;
}

interface Invitation {
  id: string;
  slug: string;
  groom_name: string;
  bride_name: string;
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", phone: "" });
  const [importData, setImportData] = useState("");

  const fetchGuests = useCallback(async (invitationId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("guests")
      .select("*")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false });
    setGuests(data || []);
  }, []);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: invData } = await supabase
        .from("invitations")
        .select("id, slug, groom_name, bride_name")
        .eq("user_id", user.id);
      setInvitations(invData || []);

      if (invData && invData.length > 0) {
        setSelectedInvitation(invData[0].id);
        fetchGuests(invData[0].id);
      }
    }
  }, [fetchGuests]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      // Small delay to ensure any synchronous lifecycle work is complete
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (isMounted) {
        await fetchData();
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  async function addGuest() {
    if (!newGuest.name) return;

    const supabase = createClient();
    const uniqueCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    const { data, error } = await supabase
      .from("guests")
      .insert({
        invitation_id: selectedInvitation,
        name: newGuest.name,
        phone: newGuest.phone,
        unique_link_code: uniqueCode,
        is_sent: false,
      })
      .select();

    if (!error && data) {
      setGuests([data[0], ...guests]);
      setNewGuest({ name: "", phone: "" });
      setShowAddModal(false);
    }
  }

  async function importGuests() {
    const lines = importData.split("\n");
    const supabase = createClient();

    for (const line of lines) {
      const [name, phone] = line.split(",");
      if (name && name.trim()) {
        const uniqueCode = Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase();
        await supabase.from("guests").insert({
          invitation_id: selectedInvitation,
          name: name.trim(),
          phone: phone?.trim() || "",
          unique_link_code: uniqueCode,
          is_sent: false,
        });
      }
    }

    fetchGuests(selectedInvitation);
    setImportData("");
    alert("Import berhasil!");
  }

  async function sendWhatsApp(guest: Guest) {
    const invitation = invitations.find((i) => i.id === selectedInvitation);
    const message = `Halo ${guest.name},\n\nKami mengundang Anda untuk hadir di acara pernikahan ${invitation?.groom_name} & ${invitation?.bride_name}.\n\nLihat undangan: ${window.location.origin}/${invitation?.slug}?to=${guest.unique_link_code}\n\nKonfirmasi kehadiran Anda ya!`;
    window.open(
      `https://wa.me/${guest.phone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar (sama seperti dashboard) */}
      <aside className="w-64 h-screen bg-slate-900 text-white p-6 sticky top-0">
        <div className="text-xl font-bold mb-10 text-amber-400">KISAHKITA</div>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/dashboard/editor"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Undangan
          </Link>
          <Link
            href="/dashboard/guests"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Daftar Tamu
          </Link>
          <Link
            href="/dashboard/gallery"
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
            Galeri
          </Link>
          <Link
            href="/dashboard/rsvp"
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            RSVP & Buku Tamu
          </Link>
          <Link
            href="/dashboard/settings"
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
              window.location.href = "/";
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
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Daftar Tamu</h1>
            <p className="text-slate-500">Kelola dan kirim undangan ke tamu</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-amber-700 transition flex items-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah Tamu
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg font-semibold hover:bg-slate-200 transition flex items-center gap-2"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Import Bulk
            </button>
          </div>
        </header>

        {/* Modal Import Bulk */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Import Bulk Tamu</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Masukkan daftar tamu dengan format: <b>Nama, Nomor WA</b> (satu
                tamu per baris)
              </p>
              <textarea
                className="w-full p-3 border border-slate-300 rounded-lg h-48 mb-4 outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Budi, 081234567890&#10;Sari, 08987654321"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
              ></textarea>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    await importGuests();
                    setShowImportModal(false);
                  }}
                  className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                  Mulai Import
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pilih Undangan */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <label className="block text-sm font-semibold text-slate-600 mb-2">
            Pilih Undangan
          </label>
          <select
            value={selectedInvitation}
            onChange={(e) => {
              setSelectedInvitation(e.target.value);
              fetchGuests(e.target.value);
            }}
            className="w-full md:w-64 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {invitations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.groom_name || "Undangan"} & {inv.bride_name || ""}
              </option>
            ))}
          </select>
        </div>

        {/* Tabel Tamu */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-600">
                    Nama
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-600">
                    Nomor WhatsApp
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-600">
                    Link Unik
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-600">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4">{guest.name}</td>
                    <td className="p-4">{guest.phone || "-"}</td>
                    <td className="p-4">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {guest.unique_link_code}
                      </code>
                    </td>
                    <td className="p-4">
                      {guest.is_sent ? (
                        <span className="text-green-600 text-sm">Terkirim</span>
                      ) : (
                        <span className="text-yellow-600 text-sm">
                          Belum dikirim
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => sendWhatsApp(guest)}
                          className="text-green-600 hover:text-green-700"
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
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </button>
                        <button className="text-blue-600 hover:text-blue-700">
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
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {guests.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-500">
                Belum ada tamu. Tambahkan tamu pertama Anda!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Tambah Tamu */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Tambah Tamu</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Nama Tamu
                </label>
                <input
                  type="text"
                  value={newGuest.name}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, name: e.target.value })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={newGuest.phone}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, phone: e.target.value })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="081234567890"
                />
              </div>
              <button
                onClick={addGuest}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
