"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

export function AddCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to add category");
      return;
    }
    setName("");
    setDescription("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-cream border border-gold-400/20 p-6 space-y-3 mb-8 max-w-lg">
      <h2 className="text-sm uppercase tracking-wider text-gold-600 mb-2">Add Category</h2>
      <input required placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
      <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-teal-900 text-cream text-sm uppercase tracking-wider hover:bg-teal-800 transition-colors disabled:opacity-60"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
        Add
      </button>
    </form>
  );
}
