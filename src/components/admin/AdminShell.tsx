"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tags, ShoppingCart, LogOut, ExternalLink } from "lucide-react";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export function AdminShell({ name, children }: { name: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col lg:flex-row">
      <aside className="lg:w-64 bg-teal-950 text-cream shrink-0">
        <div className="p-6 border-b border-gold-400/15">
          <span className="font-display text-2xl text-gold-400">{SITE.name}</span>
          <p className="text-[10px] uppercase tracking-[0.25em] text-cream/50 mt-1">Admin Portal</p>
        </div>
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-3 gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                  active ? "bg-gold-500 text-teal-950 font-medium" : "text-cream/70 hover:bg-cream/5 hover:text-cream"
                }`}
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gold-400/15 mt-2 hidden lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/70 hover:text-cream transition-colors">
            <ExternalLink size={16} /> View Store
          </Link>
          <p className="px-4 pt-2 text-xs text-cream/40 truncate">{name}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/70 hover:text-cream transition-colors w-full"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
        <div className="p-3 lg:hidden">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-xs text-cream/70 hover:text-cream transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 bg-cream-dark/30 p-5 sm:p-8">{children}</div>
    </div>
  );
}
