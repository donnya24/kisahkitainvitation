// components/OrderModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    sku: string;
  };
}

export default function OrderModal({
  isOpen,
  onClose,
  product,
}: OrderModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    package: "populer",
    quantity: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Cek apakah user sudah login
    const session = localStorage.getItem("supabaseSession");

    if (!session) {
      // Redirect ke registrasi dengan menyimpan data order
      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          product,
          formData,
        }),
      );
      router.push("/register");
    } else {
      // Proses checkout
      router.push(
        `/checkout?product=${product.id}&package=${formData.package}&quantity=${formData.quantity}`,
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Order Sekarang</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Steps Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${step > s ? "bg-green-600" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Paket
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["populer", "pro"].map((pkg) => (
                      <label
                        key={pkg}
                        className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                          formData.package === pkg
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="package"
                          value={pkg}
                          checked={formData.package === pkg}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="font-semibold text-gray-900 capitalize">
                          {pkg}
                        </div>
                        <div className="text-green-600 font-bold">
                          {pkg === "populer" ? "Rp 120,000" : "Rp 199,000"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {pkg === "populer" ? "Paket Hemat" : "Paket Lengkap"}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg w-32">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          quantity: Math.max(1, formData.quantity - 1),
                        })
                      }
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full text-center py-2 outline-none"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          quantity: formData.quantity + 1,
                        })
                      }
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Konfirmasi Pesanan
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                  <p>
                    <strong>Produk:</strong> {product.name}
                  </p>
                  <p>
                    <strong>SKU:</strong> {product.sku}
                  </p>
                  <p>
                    <strong>Paket:</strong> {formData.package.toUpperCase()}
                  </p>
                  <p>
                    <strong>Jumlah:</strong> {formData.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> Rp{" "}
                    {(formData.package === "populer" ? 120000 : 199000) *
                      formData.quantity}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Kembali
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                >
                  Lanjut
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                >
                  Konfirmasi Order
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
