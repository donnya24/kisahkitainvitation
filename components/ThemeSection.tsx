"use client";

import { useState } from "react";
import ThemeMockup from "./ThemeMockup";

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

interface ThemeSectionProps {
  initialTemplates: Template[];
}

export default function ThemeSection({ initialTemplates }: ThemeSectionProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  const categories = [
    "Semua",
    "Pernikahan",
    "Adat",
    "Ulang Tahun",
    "Tasyakuran",
    "Floral",
    "Luxury Art",
  ];

  const filteredTemplates =
    activeCategory === "Semua"
      ? initialTemplates
      : initialTemplates.filter((t) => {
          const mapping: Record<string, string> = {
            Modern: "Pernikahan",
            Rustic: "Adat",
            Minimalist: "Floral",
          };
          const displayCategory = mapping[t.category] || t.category;
          return displayCategory === activeCategory;
        });

  const getDisplayCategory = (dbCategory: string) => {
    const mapping: Record<string, string> = {
      Modern: "Pernikahan",
      Rustic: "Adat",
      Minimalist: "Floral",
    };
    return mapping[dbCategory] || dbCategory;
  };

  const getFeaturesArray = (features: string[] | string): string[] => {
    if (Array.isArray(features)) return features;
    try {
      return JSON.parse(features) as string[];
    } catch {
      return [];
    }
  };

  return (
    <section id="tema" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pilih Tema Undangan Favoritmu
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tersedia berbagai tema menarik untuk setiap momen spesialmu
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                activeCategory === category
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="relative h-48 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                {template.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={template.thumbnail_url}
                    alt={template.name}
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
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {getDisplayCategory(template.category)}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {template.name}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {getFeaturesArray(template.features).slice(0, 2).join(" • ")}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-green-600">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(template.price_basic)}
                    </span>
                  </div>
                  <button
                    className="px-3 py-1.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                    }}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Theme Mockup Modal */}
        {selectedTemplate && (
          <ThemeMockup
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
          />
        )}
      </div>
    </section>
  );
}
