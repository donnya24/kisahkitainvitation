"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themeCategories = [
    { name: "Semua", href: "/tema" },
    { name: "Pernikahan", href: "/tema/pernikahan" },
    { name: "Adat", href: "/tema/adat" },
    { name: "Ulang Tahun", href: "/tema/ulang-tahun" },
    { name: "Tasyakuran", href: "/tema/tasyakuran" },
    { name: "Floral", href: "/tema/floral" },
    { name: "Luxury Art", href: "/tema/luxury-art" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-linear-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Kisah<span className="text-green-600">Kita</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Theme Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Tema
                <svg
                  className={`w-4 h-4 transition-transform ${isThemeMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isThemeMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
                  {themeCategories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setIsThemeMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/portofolio"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Portofolio
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Cara Kerja
            </Link>
            <Link
              href="#faqs"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              FAQs
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/login"
              className="px-5 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all transform hover:scale-105 shadow-sm"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg"
              >
                <span>Tema</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isThemeMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isThemeMenuOpen && (
                <div className="pl-8 space-y-2">
                  {themeCategories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block px-4 py-2 text-gray-600 hover:text-green-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href="/portofolio"
                className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Portofolio
              </Link>
              <Link
                href="#how-it-works"
                className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Cara Kerja
              </Link>
              <Link
                href="#faqs"
                className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                FAQs
              </Link>

              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-center text-gray-700 hover:bg-green-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-center bg-green-600 text-white rounded-xl hover:bg-green-700"
                  onClick={() => setIsOpen(false)}
                >
                  Daftar Gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
