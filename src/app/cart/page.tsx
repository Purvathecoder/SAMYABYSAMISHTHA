"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { ProductVisual } from "@/components/ProductVisual";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-teal-800/20 mb-5" />
        <h1 className="font-display text-3xl text-teal-900 mb-3">Your bag is empty</h1>
        <p className="text-teal-800/60 mb-8">Looks like you haven't added anything yet.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-900 text-cream text-sm uppercase tracking-wider hover:bg-teal-800 transition-colors"
        >
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const subtotal = totalPrice();
  const shipping = subtotal >= 149900 ? 0 : 7900;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="font-display text-3xl sm:text-4xl text-teal-900 mb-10">Your Shopping Bag</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-5">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-5 border-b border-teal-800/10">
              <Link href={`/product/${item.slug}`} className="shrink-0">
                <ProductVisual category={item.category} className="w-24 h-24 sm:w-28 sm:h-28 rounded-sm" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-teal-900 font-medium leading-snug hover:text-gold-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gold-600 font-semibold mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-teal-800/20">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-teal-800 hover:bg-teal-800/5"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-9 text-center text-sm text-teal-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-teal-800 hover:bg-teal-800/5"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1.5 text-xs text-teal-800/50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
              <p className="hidden sm:block text-teal-900 font-semibold w-24 text-right shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gold-400/30 p-6 sm:p-8 sticky top-28">
            <h2 className="font-display text-2xl text-teal-900 mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-teal-800/70">
                <span>Subtotal</span>
                <span className="text-teal-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-teal-800/70">
                <span>Shipping</span>
                <span className="text-teal-900">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gold-600">Add {formatPrice(149900 - subtotal)} more for free shipping</p>
              )}
            </div>
            <div className="flex justify-between items-baseline mt-5 pt-5 border-t border-teal-800/10">
              <span className="text-teal-900 uppercase text-sm tracking-wider">Total</span>
              <span className="font-display text-3xl text-teal-900">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-gold-500 text-teal-950 font-semibold uppercase tracking-wider text-sm hover:bg-gold-400 transition-colors"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link
              href="/shop"
              className="mt-3 flex items-center justify-center w-full py-3 border border-teal-900 text-teal-900 uppercase tracking-wider text-sm hover:bg-teal-900 hover:text-cream transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
