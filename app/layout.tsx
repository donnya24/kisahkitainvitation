import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "KisahKita - Platform Undangan Digital Modern",
  description:
    "Buat undangan digital untuk pernikahan, ulang tahun, tasyakuran, dan berbagai acara spesialmu dengan mudah dan cepat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} ${poppins.variable}`}>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
