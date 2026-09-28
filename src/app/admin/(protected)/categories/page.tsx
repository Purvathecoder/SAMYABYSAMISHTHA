import { prisma } from "@/lib/prisma";
import { AddCategoryForm } from "@/components/admin/CategoryForm";
import { DeleteCategoryButton } from "@/components/admin/DeleteButtons";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-teal-900 mb-8">Categories</h1>

      <AddCategoryForm />

      <div className="bg-cream border border-gold-400/20 overflow-x-auto max-w-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-teal-800/50 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Slug</th>
              <th className="px-5 py-3 font-normal">Products</th>
              <th className="px-5 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-teal-800/5 hover:bg-teal-900/5">
                <td className="px-5 py-3 text-teal-900">{c.name}</td>
                <td className="px-5 py-3 text-teal-800/60">/{c.slug}</td>
                <td className="px-5 py-3 text-teal-800/70">{c._count.products}</td>
                <td className="px-5 py-3 text-right">
                  <DeleteCategoryButton id={c.id} name={c.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
