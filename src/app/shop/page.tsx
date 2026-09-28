import { getAllProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 0;

export const metadata = { title: "Shop All | Samya By Samishtha" };

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-600">Full Collection</p>
        <h1 className="font-display text-4xl sm:text-5xl text-teal-900 mt-2">Shop All Jewellery</h1>
        <p className="text-teal-800/60 mt-3 max-w-lg mx-auto text-sm">
          {products.length} handpicked pieces across earrings, bangles, necklaces, pendants & gifting.
        </p>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-3 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Link
          href="/shop"
          className="shrink-0 px-5 py-2 text-xs uppercase tracking-wider bg-teal-900 text-cream"
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="shrink-0 px-5 py-2 text-xs uppercase tracking-wider border border-teal-900/30 text-teal-900 hover:bg-teal-900 hover:text-cream transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {products.map((p) => (
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
  );
}
