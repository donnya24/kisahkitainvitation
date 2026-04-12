// components/ProductCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import OrderModal from "./OrderModal";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    thumbnail: string;
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
        <div className="relative h-56 overflow-hidden bg-gray-100">
          <Image
            src={product.thumbnail || "/images/placeholder.jpg"}
            alt={product.name}
            width={500}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -40%
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs text-gray-500 mb-1">{product.sku}</div>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-green-600">
              Rp {product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400 line-through">
              Rp {(product.price / 0.6).toLocaleString()}
            </span>
          </div>

          <div className="flex gap-2">
            <a
              href={`/demo/${product.id}`}
              target="_blank"
              className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm text-center hover:bg-gray-50"
            >
              Preview
            </a>
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
            >
              ORDER NOW
            </button>
          </div>
        </div>
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={product}
      />
    </>
  );
}
