import Link from "next/link";
import { ProductVisual } from "@/components/ProductVisual";
import { formatPrice } from "@/lib/format";
import { AddToCartQuickButton } from "@/components/AddToCartButtons";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  category: { name: string; slug: string };
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden">
          <ProductVisual
            category={product.category.slug}
            className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-105"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-teal-900 text-gold-100 text-[10px] uppercase tracking-wider px-2.5 py-1">
              {discount}% Off
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-3 right-3 bg-cream/90 text-teal-900 text-[10px] uppercase tracking-wider px-2.5 py-1">
              Low Stock
            </span>
          )}
        </div>
        <div className="pt-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600">{product.category.name}</p>
          <h3 className="text-sm sm:text-base text-teal-900 mt-1 leading-snug line-clamp-2 group-hover:text-gold-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-teal-900 font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-teal-800/40 line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
        </div>
      </Link>
      <div className="mt-2">
        <AddToCartQuickButton product={product} />
      </div>
    </div>
  );
}
