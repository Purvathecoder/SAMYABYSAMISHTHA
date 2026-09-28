"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

function useDeleter(url: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const res = await fetch(url, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to delete");
    }
  }

  return { run, loading };
}

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const { run, loading } = useDeleter(`/api/admin/products/${id}`);
  return (
    <button
      onClick={() => confirm(`Delete "${name}"? This cannot be undone.`) && run()}
      disabled={loading}
      className="text-red-500 hover:text-red-600 text-xs uppercase tracking-wide inline-flex items-center gap-1 disabled:opacity-50"
    >
      <Trash2 size={12} /> Delete
    </button>
  );
}

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const { run, loading } = useDeleter(`/api/admin/categories/${id}`);
  return (
    <button
      onClick={() => confirm(`Delete category "${name}"?`) && run()}
      disabled={loading}
      className="text-red-500 hover:text-red-600 text-xs uppercase tracking-wide inline-flex items-center gap-1 disabled:opacity-50"
    >
      <Trash2 size={12} /> Delete
    </button>
  );
}
