"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { ProductActions } from "@/components/AddToCartButtons";
import type { ProductCardData } from "@/components/ProductCard";

export function ProductActionsWrapper({ product }: { product: ProductCardData }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-teal-800/60 mb-2">Quantity</p>
        <div className="inline-flex items-center border border-teal-800/20">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 text-teal-800 hover:bg-teal-800/5"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>
          <span className="w-12 text-center text-teal-900">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="p-3 text-teal-800 hover:bg-teal-800/5"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
      <ProductActions product={product} quantity={quantity} />
    </div>
  );
}
