"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Tag, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { ProductVisual } from "@/components/ProductVisual";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  const subtotal = totalPrice();
  const discount = couponApplied ? Math.round(subtotal * 0.2) : 0;
  const shipping = subtotal - discount >= 149900 ? 0 : 7900;
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-teal-800/20 mb-5" />
        <h1 className="font-display text-3xl text-teal-900 mb-3">Nothing to checkout</h1>
        <Link href="/shop" className="inline-flex px-8 py-3.5 bg-teal-900 text-cream text-sm uppercase tracking-wider hover:bg-teal-800 transition-colors">
          Shop Now
        </Link>
      </div>
    );
  }

  function updateField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod,
          couponCode: couponApplied ? coupon : undefined,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      clearCart();
      router.push(`/order-confirmation/${data.order.id}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="font-display text-3xl sm:text-4xl text-teal-900 mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-sm uppercase tracking-[0.2em] text-gold-600 mb-4">Contact & Shipping</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Full Name" value={form.customerName} onChange={(e) => updateField("customerName", e.target.value)} className="input-field sm:col-span-2" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="input-field" />
              <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="input-field" />
              <textarea required placeholder="Address (House no, street, area)" value={form.address} onChange={(e) => updateField("address", e.target.value)} className="input-field sm:col-span-2 min-h-[80px]" />
              <input required placeholder="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} className="input-field" />
              <input required placeholder="State" value={form.state} onChange={(e) => updateField("state", e.target.value)} className="input-field" />
              <input required placeholder="Pincode" value={form.pincode} onChange={(e) => updateField("pincode", e.target.value)} className="input-field" />
              <textarea placeholder="Order notes (optional)" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} className="input-field sm:col-span-2 min-h-[60px]" />
            </div>
          </section>

          <section>
            <h2 className="text-sm uppercase tracking-[0.2em] text-gold-600 mb-4">Payment Method</h2>
            <div className="space-y-2.5">
              {[
                { id: "COD", label: "Cash on Delivery" },
                { id: "UPI", label: "UPI / Pay on Delivery link" },
                { id: "CARD", label: "Card (Pay on Delivery link)" },
              ].map((opt) => (
                <label key={opt.id} className={`flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors ${paymentMethod === opt.id ? "border-teal-900 bg-teal-900/5" : "border-teal-800/20"}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="accent-teal-900"
                  />
                  <span className="text-sm text-teal-900">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gold-400/30 p-6 sm:p-8 sticky top-28">
            <h2 className="font-display text-2xl text-teal-900 mb-5">Order Summary</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <ProductVisual category={item.category} className="w-14 h-14 rounded-sm shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-teal-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-teal-800/50">Qty {item.quantity}</p>
                  </div>
                  <p className="text-xs text-teal-900 font-medium shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-5">
              <div className="flex-1 flex items-center gap-2 border border-teal-800/20 px-3">
                <Tag size={14} className="text-teal-800/40" />
                <input
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full py-2.5 text-sm outline-none bg-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setCouponApplied(coupon.toUpperCase() === "RK20")}
                className="px-4 text-xs uppercase tracking-wider border border-teal-900 text-teal-900 hover:bg-teal-900 hover:text-cream transition-colors"
              >
                Apply
              </button>
            </div>
            {coupon && !couponApplied && (
              <p className="text-xs text-red-500 -mt-3 mb-4">Invalid or not applied yet.</p>
            )}
            {couponApplied && (
              <p className="text-xs text-green-700 -mt-3 mb-4">RK20 applied — 20% off!</p>
            )}

            <div className="space-y-2.5 text-sm border-t border-teal-800/10 pt-4">
              <div className="flex justify-between text-teal-800/70">
                <span>Subtotal</span>
                <span className="text-teal-900">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount (RK20)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-teal-800/70">
                <span>Shipping</span>
                <span className="text-teal-900">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
            </div>
            <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-teal-800/10">
              <span className="text-teal-900 uppercase text-sm tracking-wider">Total</span>
              <span className="font-display text-3xl text-teal-900">{formatPrice(total)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-gold-500 text-teal-950 font-semibold uppercase tracking-wider text-sm hover:bg-gold-400 transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
