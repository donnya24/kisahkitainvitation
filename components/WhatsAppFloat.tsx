"use client";

import { useState } from "react";

export default function WhatsAppFloat() {
  const [isHovered, setIsHovered] = useState(false);

  const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp Anda
  const message =
    "Halo KisahKita.id, saya tertarik dengan platform undangan digitalnya. Bisa info lebih lanjut?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />

        {/* Button */}
        <div
          className={`relative bg-green-500 rounded-full p-4 shadow-lg transition-all duration-300 ${
            isHovered ? "scale-110 bg-green-600" : ""
          }`}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12.032 12.032c.728-.728 1.456-1.456 2.184-2.184.292-.292.292-.584 0-.876-.292-.292-.584-.292-.876 0-.728.728-1.456 1.456-2.184 2.184-.292.292-.292.584 0 .876.292.292.584.292.876 0z" />
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.968.524 3.82 1.444 5.428L2.083 19.5c-.292.876.584 1.752 1.46 1.46l2.072-.722C7.18 21.476 9.032 22 11 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.752 0-3.38-.584-4.708-1.46l-.292-.292-2.656.876.876-2.656-.292-.292C4.584 15.38 4 13.752 4 12c0-4.38 3.62-8 8-8s8 3.62 8 8-3.62 8-8 8z" />
          </svg>
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
            Chat dengan kami
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-gray-800" />
          </div>
        )}
      </div>
    </a>
  );
}
