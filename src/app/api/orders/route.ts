import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function genOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SBS-${ts}${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      couponCode,
      notes,
      items,
    } = body;

    if (!customerName || !email || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = items.map((i: { id: string }) => i.id);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    let subtotal = 0;
    const orderItemsData = items.map((cartItem: { id: string; quantity: number }) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) throw new Error(`Product ${cartItem.id} not found`);
      const qty = Math.max(1, Math.min(cartItem.quantity, product.stock || cartItem.quantity));
      subtotal += product.price * qty;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.images,
      };
    });

    let discount = 0;
    if (couponCode && couponCode.toUpperCase() === "RK20") {
      discount = Math.round(subtotal * 0.2);
    }

    const shipping = subtotal - discount >= 149900 ? 0 : 7900;
    const total = subtotal - discount + shipping;

    const order = await prisma.order.create({
      data: {
        orderNumber: genOrderNumber(),
        customerName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        subtotal,
        discount,
        shipping,
        total,
        couponCode: couponCode || null,
        paymentMethod: paymentMethod || "COD",
        notes: notes || null,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    await Promise.all(
      orderItemsData.map((item: { productId: string; quantity: number }) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
