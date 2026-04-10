"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Apa itu KisahKita.id?",
      answer:
        "KisahKita.id adalah platform undangan digital modern yang memungkinkan Anda membuat undangan online untuk berbagai acara seperti pernikahan, ulang tahun, tasyakuran, dan lainnya dengan mudah dan cepat.",
    },
    {
      question: "Apakah bisa custom desain undangan?",
      answer:
        "Ya, Anda bisa mengkustomisasi template yang dipilih sesuai keinginan, termasuk mengganti foto, teks, musik latar, warna tema, dan tata letak.",
    },
    {
      question: "Berapa biaya untuk membuat undangan digital?",
      answer:
        "Kami memiliki berbagai paket mulai dari GRATIS untuk Basic, Rp199.000 untuk Premium, dan Rp399.000 untuk Gold. Setiap paket memiliki fitur yang berbeda-beda.",
    },
    {
      question: "Bagaimana cara mengirim undangan ke tamu?",
      answer:
        "Setelah undangan selesai, Anda akan mendapatkan link unik yang bisa dibagikan melalui WhatsApp, email, atau media sosial. Tamu cukup klik link untuk melihat undangan.",
    },
    {
      question: "Apakah tamu perlu login untuk melihat undangan?",
      answer:
        "Tidak, tamu tidak perlu login. Mereka bisa langsung melihat undangan dan mengisi konfirmasi kehadiran.",
    },
    {
      question: "Bisakah melacak siapa saja yang sudah membuka undangan?",
      answer:
        "Ya, di dashboard Anda bisa melihat statistik undangan, termasuk jumlah yang sudah membuka, konfirmasi kehadiran, dan pesan dari tamu.",
    },
  ];

  return (
    <section id="faqs" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-gray-600">
            Temukan jawaban dari pertanyaan yang paling sering ditanyakan
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-green-600 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
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

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
