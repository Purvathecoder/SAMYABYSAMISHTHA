"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Mail, ExternalLink, Camera } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-teal-950 text-cream mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-3xl text-gold-400">{SITE.name}</span>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-100/70 mt-1">{SITE.tagline}</p>
          <p className="text-sm text-cream/60 mt-4 leading-relaxed max-w-xs">
            {SITE.description}
          </p>
          <div className="flex items-center gap-4 mt-5">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full border border-gold-400/30 hover:bg-gold-400/10 transition-colors">
              <Camera size={16} />
            </a>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="p-2 rounded-full border border-gold-400/30 hover:bg-gold-400/10 transition-colors">
              <MessageCircle size={16} />
            </a>
            <a href={`mailto:${SITE.email}`} aria-label="Email" className="p-2 rounded-full border border-gold-400/30 hover:bg-gold-400/10 transition-colors">
              <Mail size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm text-cream/70">
            {NAV_LINKS.slice(1).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold-100 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-4">Help</h4>
          <ul className="space-y-2.5 text-sm text-cream/70">
            <li><Link href="/cart" className="hover:text-gold-100 transition-colors">My Cart</Link></li>
            <li><Link href="/shop" className="hover:text-gold-100 transition-colors">Track / My Orders</Link></li>
            <li>
              <a href={SITE.amazonStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-100 transition-colors inline-flex items-center gap-1">
                Shop on Amazon <ExternalLink size={12} />
              </a>
            </li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-gold-100 transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-4">Our Promise</h4>
          <ul className="space-y-2.5 text-sm text-cream/70">
            <li>Skin-friendly, tarnish-resistant plating</li>
            <li>7-day easy returns</li>
            <li>Secure checkout, COD available</li>
            <li>Handpicked, limited-batch designs</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-400/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/50">
          <p>&copy; {new Date().getFullYear()} {SITE.fullName}. All rights reserved.</p>
          <p>Made with care for the modern bride & everyday queen.</p>
        </div>
      </div>
    </footer>
  );
}
