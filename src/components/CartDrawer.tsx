"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { ProductVisual } from "@/components/ProductVisual";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCart();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-teal-950/50" onClick={closeCart} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-cream shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-400/25">
          <h2 className="font-display text-2xl text-teal-900 flex items-center gap-2">
            <ShoppingBag size={20} /> Your Bag ({items.length})
          </h2>
          <button onClick={closeCart} aria-label="Close cart" className="p-2 text-teal-900">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} className="text-teal-800/30" />
            <p className="text-teal-800/70">Your bag is empty. Time to add some sparkle.</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="px-6 py-2.5 bg-teal-900 text-cream text-sm uppercase tracking-wider hover:bg-teal-800 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-teal-800/10">
                  <Link href={`/product/${item.slug}`} onClick={closeCart} className="shrink-0">
                    <ProductVisual category={item.category} className="w-20 h-20 rounded-sm" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`} onClick={closeCart}>
                      <h3 className="text-sm text-teal-900 font-medium leading-snug line-clamp-2">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-gold-600 font-semibold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-teal-800/20">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-teal-800 hover:bg-teal-800/5"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm text-teal-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-teal-800 hover:bg-teal-800/5"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-teal-800/50 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gold-400/25 px-5 py-5 space-y-4">
              <div className="flex items-center justify-between text-teal-900">
                <span className="text-sm uppercase tracking-wider">Subtotal</span>
                <span className="font-display text-2xl">{formatPrice(totalPrice())}</span>
              </div>
              <p className="text-xs text-teal-800/60">Shipping & taxes calculated at checkout.</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full text-center py-3.5 bg-gold-500 text-teal-950 font-semibold uppercase tracking-wider text-sm hover:bg-gold-400 transition-colors"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full text-center py-3 border border-teal-900 text-teal-900 uppercase tracking-wider text-sm hover:bg-teal-900 hover:text-cream transition-colors"
              >
                View Bag
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
