"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import type { ProductCardData } from "@/components/ProductCard";

export function AddToCartQuickButton({ product }: { product: ProductCardData }) {
  const addItem = useCart((s) => s.addItem);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        addItem({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.category.slug,
          category: product.category.slug,
          stock: product.stock,
        });
      }}
      disabled={product.stock <= 0}
      className="w-full flex items-center justify-center gap-2 py-2.5 border border-teal-900 text-teal-900 text-xs uppercase tracking-wider hover:bg-teal-900 hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <ShoppingBag size={14} />
      {product.stock <= 0 ? "Out of Stock" : "Add to Bag"}
    </button>
  );
}

export function ProductActions({
  product,
  quantity,
}: {
  product: ProductCardData;
  quantity: number;
}) {
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();

  const buildItem = () => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.category.slug,
    category: product.category.slug,
    stock: product.stock,
  });

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => addItem(buildItem(), quantity)}
        disabled={product.stock <= 0}
        className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-teal-900 text-teal-900 uppercase tracking-wider text-sm font-medium hover:bg-teal-900 hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ShoppingBag size={16} />
        Add to Bag
      </button>
      <button
        onClick={() => {
          addItem(buildItem(), quantity);
          router.push("/checkout");
        }}
        disabled={product.stock <= 0}
        className="flex-1 py-4 bg-gold-500 text-teal-950 uppercase tracking-wider text-sm font-semibold hover:bg-gold-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Buy Now
      </button>
    </div>
  );
}
