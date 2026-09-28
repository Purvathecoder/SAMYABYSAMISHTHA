import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminApi";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;

  const { id } = await params;
  const body = await req.json();
  const { name, description, price, compareAtPrice, sku, stock, material, categoryId, isFeatured, isGift, isActive } = body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(compareAtPrice !== undefined && { compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null }),
      ...(sku !== undefined && { sku }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(material !== undefined && { material }),
      ...(categoryId !== undefined && { categoryId }),
      ...(isFeatured !== undefined && { isFeatured: !!isFeatured }),
      ...(isGift !== undefined && { isGift: !!isGift }),
      ...(isActive !== undefined && { isActive: !!isActive }),
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
