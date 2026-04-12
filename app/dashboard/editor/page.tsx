// app/dashboard/editor/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string;
  price_basic: number;
}

export default function EditorPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    slug: "",
    groom_name: "",
    groom_nickname: "",
    bride_name: "",
    bride_nickname: "",
    groom_father: "",
    groom_mother: "",
    bride_father: "",
    bride_mother: "",
    akad_date: "",
    akad_time: "",
    akad_location: "",
    akad_address: "",
    reception_date: "",
    reception_time: "",
    reception_location: "",
    reception_address: "",
    package_type: "Premium",
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("templates")
        .select("*")
        .eq("is_active", true);
      setTemplates(data || []);
      setIsLoading(false);
    };

    fetchTemplates();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Buat slug dari nama
    const slug =
      formData.slug ||
      `${formData.groom_nickname}-${formData.bride_nickname}`
        .toLowerCase()
        .replace(/\s/g, "-");

    const { error } = await supabase.from("invitations").insert({
      user_id: user.id,
      template_id: selectedTemplate,
      slug: slug,
      package_type: formData.package_type,
      status: "draft",
      groom_name: formData.groom_name,
      groom_nickname: formData.groom_nickname,
      bride_name: formData.bride_name,
      bride_nickname: formData.bride_nickname,
      groom_father_name: formData.groom_father,
      groom_mother_name: formData.groom_mother,
      bride_father_name: formData.bride_father,
      bride_mother_name: formData.bride_mother,
      akad_date: formData.akad_date
        ? `${formData.akad_date}T${formData.akad_time}:00+07:00`
        : null,
      akad_location: formData.akad_location,
      akad_address: formData.akad_address,
      reception_date: formData.reception_date
        ? `${formData.reception_date}T${formData.reception_time}:00+07:00`
        : null,
      reception_location: formData.reception_location,
      reception_address: formData.reception_address,
    });

    if (error) {
      alert("Gagal menyimpan: " + error.message);
    } else {
      router.push("/dashboard");
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar */}
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Undangan
          </Link>
          <Link
            href="/dashboard/guests"
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
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Editor Undangan
            </h1>
            <p className="text-slate-500">
              Status:{" "}
              <span className="text-amber-600 font-semibold">Premium</span>
            </p>
          </div>
          <button className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-amber-700 transition flex items-center gap-2">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preview Undangan
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Pilih Template */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">
              Pilih Template
            </h2>
            {isLoading ? (
              <div className="text-center py-8">Memuat template...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`cursor-pointer rounded-xl border-2 p-3 transition ${
                      selectedTemplate === template.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="font-semibold text-sm text-center">
                      {template.name}
                    </p>
                    <p className="text-xs text-slate-500 text-center">
                      {template.category}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informasi Mempelai */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">
              Informasi Mempelai
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Nama Lengkap Pria
                </label>
                <input
                  type="text"
                  name="groom_name"
                  value={formData.groom_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Contoh: Andi Pratama"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Nama Panggilan Pria
                </label>
                <input
                  type="text"
                  name="groom_nickname"
                  value={formData.groom_nickname}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Contoh: Andi"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Nama Lengkap Wanita
                </label>
                <input
                  type="text"
                  name="bride_name"
                  value={formData.bride_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Contoh: Sari Dewi"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Nama Panggilan Wanita
                </label>
                <input
                  type="text"
                  name="bride_nickname"
                  value={formData.bride_nickname}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Contoh: Sari"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Nama Ayah Pria
                </label>
                <input
                  type="text"
                  name="groom_father"
                  value={formData.groom_father}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Nama Ibu Pria
                </label>
                <input
                  type="text"
                  name="groom_mother"
                  value={formData.groom_mother}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Nama Ayah Wanita
                </label>
                <input
                  type="text"
                  name="bride_father"
                  value={formData.bride_father}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Nama Ibu Wanita
                </label>
                <input
                  type="text"
                  name="bride_mother"
                  value={formData.bride_mother}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Link Undangan */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">
              Link Undangan
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">kisahkita.id/</span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="contoh: andi-dan-sari"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              *Kosongkan untuk menggunakan nama panggilan secara otomatis
            </p>
          </div>

          {/* Akad & Resepsi */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Akad Nikah</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Tanggal Akad
                </label>
                <input
                  type="date"
                  name="akad_date"
                  value={formData.akad_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Waktu Akad
                </label>
                <input
                  type="time"
                  name="akad_time"
                  value={formData.akad_time}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Lokasi Akad
                </label>
                <input
                  type="text"
                  name="akad_location"
                  value={formData.akad_location}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Nama Gedung/Tempat"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Alamat Lengkap Akad
                </label>
                <textarea
                  name="akad_address"
                  value={formData.akad_address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Alamat lengkap dengan Google Maps link"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Resepsi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Tanggal Resepsi
                </label>
                <input
                  type="date"
                  name="reception_date"
                  value={formData.reception_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Waktu Resepsi
                </label>
                <input
                  type="time"
                  name="reception_time"
                  value={formData.reception_time}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Lokasi Resepsi
                </label>
                <input
                  type="text"
                  name="reception_location"
                  value={formData.reception_location}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Nama Gedung/Tempat"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Alamat Lengkap Resepsi
                </label>
                <textarea
                  name="reception_address"
                  value={formData.reception_address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Alamat lengkap dengan Google Maps link"
                />
              </div>
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-slate-900 text-white px-10 py-3 rounded-lg font-bold hover:bg-slate-800 transition"
            >
              Simpan Perubahan
            </button>
            <Link
              href="/dashboard"
              className="px-10 py-3 border border-slate-300 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition"
            >
              Batal
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
