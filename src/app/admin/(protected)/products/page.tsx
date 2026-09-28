import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/DeleteButtons";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-teal-900">Products ({products.length})</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-900 text-cream text-sm uppercase tracking-wider hover:bg-teal-800 transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-cream border border-gold-400/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-teal-800/50 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Category</th>
              <th className="px-5 py-3 font-normal">Price</th>
              <th className="px-5 py-3 font-normal">Stock</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-teal-800/5 hover:bg-teal-900/5">
                <td className="px-5 py-3 text-teal-900">{p.name}</td>
                <td className="px-5 py-3 text-teal-800/70">{p.category.name}</td>
                <td className="px-5 py-3 text-teal-900 font-medium">{formatPrice(p.price)}</td>
                <td className="px-5 py-3 text-teal-800/70">{p.stock}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs uppercase tracking-wide px-2 py-1 ${p.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                  <Link href={`/admin/products/${p.id}`} className="text-gold-600 hover:text-gold-500 text-xs uppercase tracking-wide">
                    Edit
                  </Link>
                  <DeleteProductButton id={p.id} name={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
