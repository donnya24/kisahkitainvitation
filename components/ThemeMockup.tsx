"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface ThemeMockupProps {
  template: Template;
  onClose: () => void;
}

interface PackageType {
  name: string;
  price: number;
  features: string[];
}

export default function ThemeMockup({ template, onClose }: ThemeMockupProps) {
  const router = useRouter();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<
    "Basic" | "Premium" | "Gold"
  >("Premium");

  const handleOrder = async () => {
    // Cek apakah user sudah login
    const session = localStorage.getItem("supabaseSession");

    if (!session) {
      // Redirect ke halaman registrasi
      router.push(
        `/register?template=${template.id}&package=${selectedPackage}`,
      );
    } else {
      // Tambah ke keranjang atau langsung checkout
      router.push(
        `/checkout?template=${template.id}&package=${selectedPackage}`,
      );
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Template ${template.name} - KisahKita.id`,
      text: `Lihat template undangan digital ${template.name} dari KisahKita.id`,
      url: `${window.location.origin}/tema/${template.id}`,
    };

    try {
      await navigator.share(shareData);
    } catch {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(shareData.url);
      alert("Link telah disalin ke clipboard!");
    }
  };

  const packages: PackageType[] = [
    {
      name: "Basic",
      price: template.price_basic,
      features: [
        "1 Template",
        "100 Tamu",
        "Gallery 10 foto",
        "Masa aktif 30 hari",
      ],
    },
    {
      name: "Premium",
      price: template.price_premium,
      features: [
        "10+ Template",
        "1000 Tamu",
        "Gallery Unlimited",
        "RSVP",
        "Amplop Digital",
        "Masa aktif 1 tahun",
      ],
    },
    {
      name: "Gold",
      price: template.price_gold,
      features: [
        "Semua Template",
        "Tamu Unlimited",
        "Live Streaming",
        "Custom Domain",
        "Masa aktif selamanya",
      ],
    },
  ];

  const selectedPackageData = packages.find((p) => p.name === selectedPackage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{template.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Mockup iPhone */}
            <div className="flex justify-center">
              <div className="relative">
                {/* iPhone 14 Frame */}
                <div className="relative w-72 h-140 bg-black rounded-[44px] shadow-2xl overflow-hidden">
                  {/* Dynamic Island */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-27.5 h-9 bg-black rounded-b-2xl z-20" />

                  {/* Screen Content */}
                  <div className="absolute inset-0.75 bg-linear-to-br from-green-50 to-emerald-100 rounded-[41px] overflow-hidden">
                    <div className="h-full flex flex-col items-center justify-center p-4">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-lg mb-4 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-green-600"
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
                      <h3 className="text-lg font-bold text-gray-800 text-center">
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Preview Undangan Digital
                      </p>
                    </div>
                  </div>

                  {/* Side Buttons */}
                  <div className="absolute left-0 top-24 w-1 h-8 bg-gray-600 rounded-l-full" />
                  <div className="absolute left-0 top-36 w-1 h-12 bg-gray-600 rounded-l-full" />
                </div>

                {/* Mockup Label */}
                <p className="text-center text-gray-500 text-sm mt-4">
                  Preview di iPhone 14
                </p>
              </div>
            </div>

            {/* Right - Details & Actions */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {template.category}
                  </span>
                  <button
                    onClick={handleShare}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600">
                  Template undangan digital dengan desain eksklusif untuk momen
                  spesialmu.
                </p>
              </div>

              {/* Package Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Paket
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.name}
                      onClick={() =>
                        setSelectedPackage(
                          pkg.name as "Basic" | "Premium" | "Gold",
                        )
                      }
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedPackage === pkg.name
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="font-semibold text-gray-900">
                        {pkg.name}
                      </div>
                      <div className="text-green-600 font-bold text-sm">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(pkg.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Fitur yang Didapat:
                </h4>
                <ul className="space-y-2">
                  {selectedPackageData?.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  href={`/demo/${template.id}`}
                  className="flex-1 px-4 py-2.5 border border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all text-center"
                >
                  Lihat Demo
                </Link>
                <button
                  onClick={handleOrder}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
                >
                  Order Sekarang
                </button>
                <button
                  onClick={() => {
                    setIsAddedToCart(!isAddedToCart);
                    // TODO: Implement add to cart logic
                  }}
                  className={`p-2.5 rounded-xl border-2 transition-all ${
                    isAddedToCart
                      ? "border-green-500 bg-green-50 text-green-600"
                      : "border-gray-200 hover:border-green-300 text-gray-600"
                  }`}
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
