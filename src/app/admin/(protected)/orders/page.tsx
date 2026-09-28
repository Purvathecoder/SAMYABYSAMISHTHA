import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const revalidate = 0;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-teal-900 mb-8">Orders ({orders.length})</h1>

      <div className="bg-cream border border-gold-400/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-teal-800/50 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-normal">Order</th>
              <th className="px-5 py-3 font-normal">Customer</th>
              <th className="px-5 py-3 font-normal">Items</th>
              <th className="px-5 py-3 font-normal">Total</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-teal-800/50">No orders yet.</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-teal-800/5 hover:bg-teal-900/5">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-teal-900 hover:text-gold-600 font-medium">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-teal-800/70">{o.customerName}</td>
                  <td className="px-5 py-3 text-teal-800/70">{o.items.length}</td>
                  <td className="px-5 py-3 text-teal-900 font-medium">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs uppercase tracking-wide px-2 py-1 ${STATUS_COLORS[o.status] || "bg-teal-900/10 text-teal-900"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-teal-800/50 text-xs">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
