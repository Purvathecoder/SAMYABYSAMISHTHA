"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";
import { useCart } from "@/store/cart";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCart((s) => s.totalItems());
  const openCart = useCart((s) => s.openCart);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-gold-400/25">
      <div className="bg-teal-900 text-gold-100 text-center text-[11px] sm:text-xs tracking-[0.2em] uppercase py-2 px-4">
        {SITE.offerText} on all orders &middot; Free shipping over ₹1499
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          <button
            className="lg:hidden p-2 -ml-2 text-teal-900"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <Link href="/" className="flex flex-col items-center lg:items-start select-none">
            <span className="font-display text-3xl sm:text-4xl tracking-wide text-teal-900 leading-none">
              {SITE.name}
            </span>
            <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gold-600 mt-0.5">
              {SITE.tagline}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide uppercase text-teal-800 hover:text-gold-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/shop"
              className="hidden sm:flex p-2 text-teal-900 hover:text-gold-600 transition-colors"
              aria-label="Search products"
            >
              <Search size={20} />
            </Link>
            <button
              onClick={openCart}
              className="relative p-2 text-teal-900 hover:text-gold-600 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-4.5 w-4.5 min-w-[18px] rounded-full bg-gold-500 text-teal-950 text-[10px] font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-teal-950/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[80%] max-w-sm bg-cream shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold-400/25">
              <span className="font-display text-2xl text-teal-900">{SITE.name}</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-2 text-teal-900">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col p-5 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-base tracking-wide uppercase text-teal-800 border-b border-teal-800/10"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
