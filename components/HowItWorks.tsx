"use client";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Pilih Tema",
      description: "Pilih template undangan digital yang sesuai dengan acaramu",
      icon: "🎨",
    },
    {
      number: "02",
      title: "Kustomisasi",
      description: "Sesuaikan dengan foto, teks, musik, dan informasi acaramu",
      icon: "✏️",
    },
    {
      number: "03",
      title: "Kirim ke Tamu",
      description:
        "Bagikan link undangan via WhatsApp, email, atau media sosial",
      icon: "📤",
    },
    {
      number: "04",
      title: "Pantau RSVP",
      description: "Lihat siapa saja yang sudah konfirmasi kehadiran",
      icon: "📊",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Cara Kerja <span className="text-green-600">KisahKita.id</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Buat undangan digital dalam 4 langkah mudah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-0.5 bg-linear-to-r from-green-200 via-green-400 to-green-200 -translate-y-1/2" />

          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="relative z-10">
                <div className="w-20 h-20 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
