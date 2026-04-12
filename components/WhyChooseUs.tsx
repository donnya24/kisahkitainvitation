"use client";

export default function WhyChooseUs() {
  const features = [
    {
      title: "Desain Eksklusif",
      description: "Berbagai pilihan tema undangan digital yang elegan dan modern.",
      icon: "✨"
    },
    {
      title: "Mudah & Cepat",
      description: "Buat undanganmu hanya dalam hitungan menit dengan editor yang simpel.",
      icon: "⚡"
    },
    {
      title: "Hemat Biaya",
      description: "Harga terjangkau dengan fitur lengkap dibandingkan undangan cetak.",
      icon: "💰"
    },
    {
      title: "Custom Domain",
      description: "Gunakan domain kustom untuk undangan pernikahanmu agar lebih personal.",
      icon: "🌐"
    },
    {
      title: "RSVP & Buku Tamu",
      description: "Kelola daftar kehadiran dan terima ucapan doa dari tamu secara real-time.",
      icon: "📝"
    },
    {
      title: "Ramah Lingkungan",
      description: "Kurangi penggunaan kertas dengan beralih ke undangan digital.",
      icon: "🌱"
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih <span className="text-gradient">KisahKita</span>?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan layanan undangan digital terbaik dengan fitur terlengkap untuk hari spesial Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
