"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export type Category = { id: string; name: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  material: string;
  categoryId: string;
  isFeatured: boolean;
  isGift: boolean;
  isActive: boolean;
};

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductFormValues;
}) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [values, setValues] = useState<ProductFormValues>(
    initial ?? {
      name: "",
      description: "",
      price: 0,
      compareAtPrice: null,
      sku: "",
      stock: 50,
      material: "",
      categoryId: categories[0]?.id ?? "",
      isFeatured: false,
      isGift: false,
      isActive: true,
    }
  );

  function update<K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-cream border border-gold-400/20 p-6 sm:p-8 max-w-2xl space-y-5">
      <div>
        <label className="text-xs uppercase tracking-wider text-teal-800/60 block mb-1.5">Product Name</label>
        <input required value={values.name} onChange={(e) => update("name", e.target.value)} className="input-field" />
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-teal-800/60 block mb-1.5">Description</label>
        <textarea required value={values.description} onChange={(e) => update("description", e.target.value)} className="input-field min-h-[100px]" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-teal-800/60 block mb-1.5">Price (in paise, e.g. 89900 = ₹899)</label>
          <input required type="number" value={values.price} onChange={(e) => update("price", Number(e.target.value))} className="input-field" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-teal-800/60 block mb-1.5">Compare-at Price (optional)</label>
          <input type="number" value={values.compareAtPrice ?? ""} onChange={(e) => update("compareAtPrice", e.target.value ? Number(e.target.value) : null)} className="input-field" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-teal-800/60 block mb-1.5">SKU</label>
          <input required value={values.sku} onChange={(e) => update("sku", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-teal-800/60 block mb-1.5">Stock</label>
          <input required type="number" value={values.stock} onChange={(e) => update("stock", Number(e.target.value))} className="input-field" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-teal-800/60 block mb-1.5">Material</label>
          <input value={values.material} onChange={(e) => update("material", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-teal-800/60 block mb-1.5">Category</label>
          <select value={values.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="input-field">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-2">
        <label className="flex items-center gap-2 text-sm text-teal-900">
          <input type="checkbox" checked={values.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} className="accent-teal-900" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-teal-900">
          <input type="checkbox" checked={values.isGift} onChange={(e) => update("isGift", e.target.checked)} className="accent-teal-900" />
          Gifting Item
        </label>
        <label className="flex items-center gap-2 text-sm text-teal-900">
          <input type="checkbox" checked={values.isActive} onChange={(e) => update("isActive", e.target.checked)} className="accent-teal-900" />
          Active (visible on site)
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-7 py-3 bg-teal-900 text-cream text-sm uppercase tracking-wider hover:bg-teal-800 transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {isEdit ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
