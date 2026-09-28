import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShieldCheck, RotateCcw, Truck } from "lucide-react";
import { getProductBySlug, getProductsByCategory } from "@/lib/data";
import { ProductVisual } from "@/components/ProductVisual";
import { formatPrice } from "@/lib/format";
import { ProductActionsWrapper } from "@/components/ProductActionsWrapper";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: `${product.name} | Samya By Samishtha` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProductsByCategory(product.category.slug))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-1.5 text-xs text-teal-800/60 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <ChevronRight size={12} />
        <Link href={`/category/${product.category.slug}`} className="hover:text-gold-600">{product.category.name}</Link>
        <ChevronRight size={12} />
        <span className="text-teal-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="grid grid-cols-4 gap-3 lg:sticky lg:top-28 self-start">
          <ProductVisual category={product.category.slug} className="col-span-4 aspect-square rounded-sm" />
          <ProductVisual category={product.category.slug} variant="teal" className="aspect-square rounded-sm" />
          <ProductVisual category={product.category.slug} className="aspect-square rounded-sm" />
          <ProductVisual category={product.category.slug} variant="teal" className="aspect-square rounded-sm" />
          <ProductVisual category={product.category.slug} className="aspect-square rounded-sm" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-600">{product.category.name}</p>
          <h1 className="font-display text-3xl sm:text-4xl text-teal-900 mt-2 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-semibold text-teal-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-base text-teal-800/40 line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="text-sm text-gold-600 font-medium">{discount}% off</span>
              </>
            )}
          </div>
          <p className="text-xs text-teal-800/50 mt-1">Inclusive of all taxes</p>

          <p className="text-teal-800/80 mt-6 leading-relaxed text-sm sm:text-base">{product.description}</p>

          {product.material && (
            <div className="mt-5 text-sm">
              <span className="text-teal-900 font-medium">Material: </span>
              <span className="text-teal-800/70">{product.material}</span>
            </div>
          )}

          <p className="text-sm mt-2">
            {product.stock > 0 ? (
              <span className="text-green-700">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          <div className="mt-8">
            <ProductActionsWrapper
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                stock: product.stock,
                category: { name: product.category.name, slug: product.category.slug },
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-teal-800/10">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck size={20} className="text-gold-600" />
              <p className="text-[11px] text-teal-800/60">Free shipping over ₹1499</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw size={20} className="text-gold-600" />
              <p className="text-[11px] text-teal-800/60">7-day easy returns</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck size={20} className="text-gold-600" />
              <p className="text-[11px] text-teal-800/60">Tarnish-resistant</p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl sm:text-3xl text-teal-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  price: p.price,
                  compareAtPrice: p.compareAtPrice,
                  stock: p.stock,
                  category: { name: p.category.name, slug: p.category.slug },
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
