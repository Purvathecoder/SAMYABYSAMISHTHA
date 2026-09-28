import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { ProductVisual } from "@/components/ProductVisual";

export const revalidate = 0;

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: { include: { category: true } } } } },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-10">
        <CheckCircle2 size={52} className="mx-auto text-gold-500 mb-4" />
        <h1 className="font-display text-3xl sm:text-4xl text-teal-900">Thank you, {order.customerName.split(" ")[0]}!</h1>
        <p className="text-teal-800/60 mt-3">Your order has been placed successfully.</p>
        <p className="text-sm text-teal-800/50 mt-1">
          Order Number: <span className="text-teal-900 font-medium">{order.orderNumber}</span>
        </p>
      </div>

      <div className="border border-gold-400/30 p-6 sm:p-8">
        <div className="space-y-4 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <ProductVisual category={item.product.category.slug} className="w-16 h-16 rounded-sm shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-teal-900">{item.name}</p>
                <p className="text-xs text-teal-800/50">Qty {item.quantity}</p>
              </div>
              <p className="text-sm text-teal-900 font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm border-t border-teal-800/10 pt-4">
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
          <div className="flex justify-between text-teal-900 font-semibold text-base pt-2 border-t border-teal-800/10">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-teal-800/10 text-sm text-teal-800/70 space-y-1">
          <p className="text-teal-900 font-medium mb-1">Shipping to:</p>
          <p>{order.address}, {order.city}, {order.state} {order.pincode}</p>
          <p>{order.phone} &middot; {order.email}</p>
          <p className="mt-2">Payment: {order.paymentMethod}</p>
        </div>
      </div>

      <div className="text-center mt-10">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-900 text-cream text-sm uppercase tracking-wider hover:bg-teal-800 transition-colors"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
