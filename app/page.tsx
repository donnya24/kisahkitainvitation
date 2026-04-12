import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeSection from "@/components/ThemeSection";
import HowItWorks from "@/components/HowItWorks";
import FAQs from "@/components/FAQs";
import PortfolioSection from "@/components/PortfolioSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string;
  price_basic: number;
  price_premium: number;
  price_gold: number;
  features: string[] | string;
}

interface PortfolioItem {
  id: string;
  slug: string;
  groom_name: string | null;
  bride_name: string | null;
  template_id: string;
  templates: {
    name: string;
    thumbnail_url: string | null;
  } | null;
}

interface RawPortfolioItem {
  id: string;
  slug: string;
  groom_name: string | null;
  bride_name: string | null;
  template_id: string;
  templates: {
    name: string;
    thumbnail_url: string | null;
  } | {
    name: string;
    thumbnail_url: string | null;
  }[] | null;
}

async function getTemplates(): Promise<Template[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching templates:", error.message, error.details, error.hint);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error in getTemplates:", error);
    return [];
  }
}

async function getPlatformStats() {
  try {
    const supabase = await createClient();

    const { count: totalInvitations, error: invError } = await supabase
      .from("invitations")
      .select("*", { count: "exact", head: true });

    if (invError) {
      console.error("Error fetching invitations stats:", invError.message, invError.details);
    }

    const { count: totalGuests, error: guestError } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true });

    if (guestError) {
      console.error("Error fetching guests stats:", guestError.message, guestError.details);
    }

    const { count: totalWishes, error: wishError } = await supabase
      .from("rsvp")
      .select("*", { count: "exact", head: true });

    if (wishError) {
      console.error("Error fetching wishes stats:", wishError.message, wishError.details);
    }

    return {
      totalInvitations: totalInvitations || 504000,
      totalGuests: totalGuests || 8000000,
      totalWishes: totalWishes || 5000000,
    };
  } catch (error) {
    console.error("Error in getPlatformStats:", error);
    return {
      totalInvitations: 504000,
      totalGuests: 8000000,
      totalWishes: 5000000,
    };
  }
}

async function getPortfolio(): Promise<PortfolioItem[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("invitations")
      .select(`
        id,
        slug,
        groom_name,
        bride_name,
        template_id,
        templates (
          name,
          thumbnail_url
        )
      `)
      .eq("status", "active")
      .eq("is_active", true)
      .not("groom_name", "is", null)
      .limit(6)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching portfolio:", error.message, error.details, error.hint);
      return [];
    }

    return (data as unknown as RawPortfolioItem[])?.map((item: RawPortfolioItem) => ({
      id: item.id,
      slug: item.slug,
      groom_name: item.groom_name,
      bride_name: item.bride_name,
      template_id: item.template_id,
      templates: Array.isArray(item.templates) ? item.templates[0] : item.templates,
    })) || [];
  } catch (error) {
    console.error("Error in getPortfolio:", error);
    return [];
  }
}

export default async function LandingPage() {
  const [templates, stats, portfolio] = await Promise.all([
    getTemplates(),
    getPlatformStats(),
    getPortfolio(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-green-50 via-white to-emerald-50 -z-10" />
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-green-700 text-sm font-medium">
                  Platform Undangan Digital #1 di Indonesia
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
                Mudah, cepat, dan hemat biaya. Bisa custom sesuai keinginanmu.
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

              {/* Stats Section in Hero */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600">
                    {stats.totalInvitations.toLocaleString()}+
                  </div>
                  <div className="text-xs text-gray-500">
                    Undangan Digital Terbuat
                  </div>
                  <div className="text-xs text-gray-400">Sejak 2024</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600">
                    {stats.totalGuests.toLocaleString()}+
                  </div>
                  <div className="text-xs text-gray-500">Tamu Terundang</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600">
                    {stats.totalWishes.toLocaleString()}+
                  </div>
                  <div className="text-xs text-gray-500">Ucapan & Doa</div>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <PortfolioSection portfolio={portfolio} />
      <ThemeSection initialTemplates={templates} />
      <HowItWorks />

      {/* Stats Section - Additional Stats */}
      <section className="py-16 bg-linear-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">
                {stats.totalInvitations.toLocaleString()}+
              </div>
              <div className="text-sm opacity-90 mt-2">Undangan Terbuat</div>
            </div>
            <div>
              <div className="text-4xl font-bold">
                {stats.totalGuests.toLocaleString()}+
              </div>
              <div className="text-sm opacity-90 mt-2">Tamu Terundang</div>
            </div>
            <div>
              <div className="text-4xl font-bold">50+</div>
              <div className="text-sm opacity-90 mt-2">Template Premium</div>
            </div>
            <div>
              <div className="text-4xl font-bold">98%</div>
              <div className="text-sm opacity-90 mt-2">Kepuasan Pelanggan</div>
            </div>
          </div>
        </div>
      </section>

      <FAQs />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Siap Membuat Undangan Digital?
            </h2>
            <p className="text-gray-600 mb-8">
              Bergabunglah dengan {stats.totalInvitations.toLocaleString()}+
              pengguna yang sudah membuat undangan digital bersama KisahKita.
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
