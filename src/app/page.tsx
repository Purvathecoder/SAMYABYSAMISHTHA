import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import { getCategories, getFeaturedProducts, getGiftProducts } from "@/lib/data";
import { CategoryTile } from "@/components/CategoryTile";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import { SITE } from "@/lib/site";

export const revalidate = 0;

export default async function Home() {
  const [categories, featured, gifts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getGiftProducts(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-teal-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 15% 25%, rgba(201,162,75,0.5), transparent 35%), radial-gradient(circle at 85% 75%, rgba(201,162,75,0.35), transparent 35%)"
        }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <p className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.3em] mb-4">
              <Sparkles size={14} /> Raksha Bandhan Special
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cream leading-tight">
              Jewellery that feels
              <span className="block text-gold-400 italic">like celebration.</span>
            </h1>
            <p className="text-cream/70 mt-5 max-w-md mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed">
              Handpicked artificial & fashion jewellery — earrings, bangles, necklaces, pendants
              and gifting sets designed for every festivity and everyday shine.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-500 text-teal-950 font-semibold uppercase tracking-wider text-sm hover:bg-gold-400 transition-colors"
              >
                Shop Collection <ArrowRight size={16} />
              </Link>
              <div className="flex items-center gap-2 border border-gold-400/40 px-5 py-3">
                <span className="text-cream/60 text-xs uppercase tracking-wider">Use Code</span>
                <span className="text-gold-400 font-semibold tracking-widest">{SITE.offerCode}</span>
                <span className="text-cream/60 text-xs">for 20% off</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-md aspect-[4/3] rounded-sm overflow-hidden ring-1 ring-gold-400/30">
              <ProductVisual category="necklace" className="w-full h-full" />
              <div className="absolute bottom-5 right-5 bg-cream px-5 py-4 shadow-xl">
                <p className="text-[10px] uppercase tracking-wider text-teal-800/60">Flat</p>
                <p className="font-display text-3xl text-teal-900 leading-none">20% <span className="text-lg">Off</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-cream-dark/60 border-y border-gold-400/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: Truck, label: "Free shipping over ₹1499" },
            { icon: RotateCcw, label: "7-day easy returns" },
            { icon: ShieldCheck, label: "Tarnish-resistant plating" },
            { icon: Sparkles, label: "Limited-batch designs" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon size={20} className="text-gold-600" />
              <p className="text-[11px] sm:text-xs text-teal-800/70 uppercase tracking-wide leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by category */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-600">Curated For You</p>
          <h2 className="font-display text-3xl sm:text-4xl text-teal-900 mt-2">Shop By Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4">
          {categories.map((cat) => (
            <CategoryTile key={cat.id} name={cat.name} slug={cat.slug} description={cat.description} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-cream-dark/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold-600">Bestsellers</p>
              <h2 className="font-display text-3xl sm:text-4xl text-teal-900 mt-2">Featured Pieces</h2>
            </div>
            <Link href="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm text-teal-900 hover:text-gold-600 uppercase tracking-wide">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {featured.map((p) => (
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
          <div className="text-center mt-10 sm:hidden">
            <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-teal-900 uppercase tracking-wide">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Gifting banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative overflow-hidden bg-teal-900 rounded-sm">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, rgba(201,162,75,0.5), transparent 40%)"
          }} />
          <div className="relative grid lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-14 text-center lg:text-left">
              <p className="text-gold-400 text-xs uppercase tracking-[0.3em] mb-3">The Gifting Edit</p>
              <h2 className="font-display text-3xl sm:text-4xl text-cream leading-tight">
                Gift her sparkle she'll cherish
              </h2>
              <p className="text-cream/70 mt-4 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
                Beautifully boxed jewellery hampers for Raksha Bandhan, weddings, birthdays
                and every moment worth celebrating.
              </p>
              <Link
                href="/category/gifting"
                className="inline-flex items-center gap-2 mt-7 px-7 py-3 bg-gold-500 text-teal-950 font-semibold uppercase tracking-wider text-sm hover:bg-gold-400 transition-colors"
              >
                Explore Gifting <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-0.5 p-0.5">
              {gifts.slice(0, 4).map((g) => (
                <ProductVisual key={g.id} category="gifting" className="aspect-square" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Amazon store CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 border border-gold-400/30 px-6 sm:px-10 py-8 text-center sm:text-left">
          <div>
            <h3 className="font-display text-2xl text-teal-900">Prefer shopping on Amazon?</h3>
            <p className="text-teal-800/60 text-sm mt-1">Find our full collection on the Samya By Samishtha Amazon storefront.</p>
          </div>
          <a
            href={SITE.amazonStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 border-2 border-teal-900 text-teal-900 uppercase tracking-wider text-sm font-medium hover:bg-teal-900 hover:text-cream transition-colors whitespace-nowrap"
          >
            Visit Amazon Store <ExternalLink size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}
