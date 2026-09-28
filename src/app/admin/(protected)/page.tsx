import Link from "next/link";
import { Package, ShoppingCart, IndianRupee, Tags } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [productCount, categoryCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  const allOrders = await prisma.order.findMany();
  const revenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total Products", value: productCount, icon: Package },
    { label: "Categories", value: categoryCount, icon: Tags },
    { label: "Total Orders", value: allOrders.length, icon: ShoppingCart },
    { label: "Revenue", value: formatPrice(revenue), icon: IndianRupee },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-teal-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-cream border border-gold-400/20 p-5">
            <Icon size={18} className="text-gold-600 mb-3" />
            <p className="text-2xl font-semibold text-teal-900">{value}</p>
            <p className="text-xs text-teal-800/50 uppercase tracking-wide mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-cream border border-gold-400/20">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-400/20">
          <h2 className="font-medium text-teal-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs uppercase tracking-wider text-gold-600 hover:text-gold-500">
            View All
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="p-8 text-center text-teal-800/50 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-teal-800/50 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 font-normal">Order</th>
                  <th className="px-5 py-3 font-normal">Customer</th>
                  <th className="px-5 py-3 font-normal">Total</th>
                  <th className="px-5 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-teal-800/5 hover:bg-teal-900/5">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="text-teal-900 hover:text-gold-600">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-teal-800/70">{o.customerName}</td>
                    <td className="px-5 py-3 text-teal-900 font-medium">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs uppercase tracking-wide px-2 py-1 bg-teal-900/10 text-teal-900">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
