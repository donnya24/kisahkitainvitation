"use client";

import Link from "next/link";

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

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
}

export default function PortfolioSection({ portfolio }: PortfolioSectionProps) {
  // Hapus baris ini karena tidak digunakan:
  // const [activeFilter, setActiveFilter] = useState('semua');

  if (!portfolio || portfolio.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Inspirasi Undangan dari{" "}
            <span className="text-gradient">KisahKita</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lihat contoh undangan digital yang telah dibuat oleh pengguna kami
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-56 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                {item.templates?.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.templates.thumbnail_url}
                    alt={item.templates.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400"
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
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    href={`/${item.slug}`}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                    target="_blank"
                  >
                    Lihat Undangan
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.groom_name && item.bride_name
                    ? `${item.groom_name} & ${item.bride_name}`
                    : item.groom_name ||
                      item.bride_name ||
                      "Undangan Pernikahan"}
                </h3>
                <p className="text-gray-500 text-sm">
                  Template: {item.templates?.name || "Premium"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/portofolio"
            className="inline-flex items-center gap-2 px-6 py-3 border border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all"
          >
            <span>Lihat Semua Portofolio</span>
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
