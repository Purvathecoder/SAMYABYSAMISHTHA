import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";

export const revalidate = 0;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return { title: `${category.name} | Samya By Samishtha` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, products, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
    getCategories(),
  ]);

  if (!category) notFound();

  return (
    <div>
      <div className="relative bg-teal-900 overflow-hidden">
        <ProductVisual category={category.slug} className="absolute inset-0 w-full h-full opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Collection</p>
          <h1 className="font-display text-4xl sm:text-5xl text-cream mt-2">{category.name}</h1>
          {category.description && (
            <p className="text-cream/70 mt-3 max-w-lg mx-auto text-sm sm:text-base">{category.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-3 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <Link
            href="/shop"
            className="shrink-0 px-5 py-2 text-xs uppercase tracking-wider border border-teal-900/30 text-teal-900 hover:bg-teal-900 hover:text-cream transition-colors"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`shrink-0 px-5 py-2 text-xs uppercase tracking-wider transition-colors ${
                cat.slug === slug
                  ? "bg-teal-900 text-cream"
                  : "border border-teal-900/30 text-teal-900 hover:bg-teal-900 hover:text-cream"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <p className="text-center text-teal-800/60 py-16">New pieces coming soon to this collection.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
