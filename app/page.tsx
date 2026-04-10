import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeSection from "@/components/ThemeSection";
import HowItWorks from "@/components/HowItWorks";
import FAQs from "@/components/FAQs";
import Link from "next/link";

// Fetch data dari database
async function getTemplates() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data || [];
}

async function getStats() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("invitations")
    .select("*", { count: "exact", head: true });
  return count || 1523; // Fallback ke data statis jika error
}

export default async function LandingPage() {
  const templates = await getTemplates();
  const totalUsers = await getStats();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-green-50 via-white to-emerald-50 -z-10" />
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-green-700 text-sm font-medium">
                  ✨ Telah digunakan oleh {totalUsers.toLocaleString()}+
                  pengguna
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Buat Undangan Digital
                <span className="text-gradient"> Spesial</span>
                <br />
                untuk Setiap Momenmu
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Platform undangan digital modern dengan berbagai tema elegan.
                Mudah, cepat, dan hemat biaya. Bisa custom sesuai keinginanmu!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Mulai Buat Undangan
                </Link>
                <Link
                  href="#how-it-works"
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Lihat Cara Kerja
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start mt-12">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">Mudah Digunakan</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    100% Customizable
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Responsive Design
                  </span>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="flex-1 relative">
              <div className="relative w-full h-100 lg:h-125 bg-linear-to-br from-green-50 to-emerald-100 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-40 h-40 bg-white rounded-2xl shadow-xl mx-auto mb-6 flex items-center justify-center">
                      <svg
                        className="w-20 h-20 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Preview Undangan Digital
                    </p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-50 animate-pulse" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-200 rounded-full opacity-50 animate-pulse delay-1000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why KisahKita Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kenapa Memilih{" "}
              <span className="text-green-600">KisahKita.id</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform undangan digital terpercaya dengan ribuan pengguna puas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-all group-hover:scale-110">
                  <div className="text-3xl">{item.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Section - Dari Database */}
      <ThemeSection initialTemplates={templates} />

      {/* How It Works */}
      <HowItWorks />

      {/* Stats Section */}
      <section className="py-16 bg-linear-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">
                {totalUsers.toLocaleString()}+
              </div>
              <div className="text-sm opacity-90 mt-2">Pengguna Aktif</div>
            </div>
            <div>
              <div className="text-4xl font-bold">50+</div>
              <div className="text-sm opacity-90 mt-2">Template Premium</div>
            </div>
            <div>
              <div className="text-4xl font-bold">98%</div>
              <div className="text-sm opacity-90 mt-2">Kepuasan Pelanggan</div>
            </div>
            <div>
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-sm opacity-90 mt-2">Dukungan</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQs />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Siap Membuat Undangan Digital?
            </h2>
            <p className="text-gray-600 mb-8">
              Bergabunglah dengan ribuan pengguna yang sudah membuat undangan
              digital bersama KisahKita.id
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Mulai Sekarang Gratis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const whyChooseUs = [
  {
    icon: "🎨",
    title: "Template Eksklusif",
    description:
      "Desain modern & elegan yang bisa dikustomisasi sesuai keinginan",
  },
  {
    icon: "⚡",
    title: "Proses Cepat",
    description: "Buat undangan digital hanya dalam hitungan menit",
  },
  {
    icon: "💸",
    title: "Hemat Biaya",
    description: "Lebih murah dari undangan cetak tradisional",
  },
  {
    icon: "🌍",
    title: "Ramah Lingkungan",
    description: "Bantu kurangi penggunaan kertas dan limbah",
  },
];
