import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const revalidate = 0;

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-teal-900">{order.orderNumber}</h1>
          <p className="text-teal-800/50 text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <OrderStatusSelect id={order.id} status={order.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-cream border border-gold-400/20 p-5">
          <h2 className="text-xs uppercase tracking-wider text-gold-600 mb-3">Customer</h2>
          <p className="text-teal-900">{order.customerName}</p>
          <p className="text-teal-800/70 text-sm">{order.email}</p>
          <p className="text-teal-800/70 text-sm">{order.phone}</p>
        </div>
        <div className="bg-cream border border-gold-400/20 p-5">
          <h2 className="text-xs uppercase tracking-wider text-gold-600 mb-3">Shipping Address</h2>
          <p className="text-teal-800/80 text-sm leading-relaxed">
            {order.address}, {order.city}, {order.state} {order.pincode}
          </p>
          <p className="text-teal-800/60 text-xs mt-2">Payment: {order.paymentMethod}</p>
        </div>
      </div>

      {order.notes && (
        <div className="bg-cream border border-gold-400/20 p-5 mb-8">
          <h2 className="text-xs uppercase tracking-wider text-gold-600 mb-2">Order Notes</h2>
          <p className="text-teal-800/80 text-sm">{order.notes}</p>
        </div>
      )}

      <div className="bg-cream border border-gold-400/20">
        <h2 className="text-xs uppercase tracking-wider text-gold-600 px-5 py-4 border-b border-gold-400/20">Items</h2>
        <div className="divide-y divide-teal-800/5">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="text-teal-900">{item.name}</p>
                <p className="text-teal-800/50 text-xs">Qty {item.quantity} &times; {formatPrice(item.price)}</p>
              </div>
              <p className="text-teal-900 font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-gold-400/20 space-y-1.5 text-sm">
          <div className="flex justify-between text-teal-800/70">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-teal-800/70">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-teal-900 font-semibold pt-2 border-t border-teal-800/10">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
