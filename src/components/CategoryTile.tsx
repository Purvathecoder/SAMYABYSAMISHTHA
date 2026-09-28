import Link from "next/link";
import { ProductVisual } from "@/components/ProductVisual";

export function CategoryTile({
  name,
  slug,
  description,
}: {
  name: string;
  slug: string;
  description?: string | null;
}) {
  return (
    <Link href={`/category/${slug}`} className="group block text-center">
      <div className="relative overflow-hidden rounded-full aspect-square mx-auto max-w-[180px] ring-1 ring-gold-400/30 group-hover:ring-gold-400 transition-all">
        <ProductVisual
          category={slug}
          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <h3 className="font-display text-xl sm:text-2xl text-teal-900 mt-4 group-hover:text-gold-600 transition-colors">
        {name}
      </h3>
      {description && (
        <p className="text-xs text-teal-800/60 mt-1 px-2 line-clamp-2 hidden sm:block">{description}</p>
      )}
    </Link>
  );
}
