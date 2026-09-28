import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminApi";

export async function GET(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;

  const body = await req.json();
  const { name, description, price, compareAtPrice, sku, stock, material, categoryId, isFeatured, isGift, isActive } = body;

  if (!name || !price || !sku || !categoryId || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      images: JSON.stringify([category?.slug || "default"]),
      sku,
      stock: stock !== undefined ? Number(stock) : 50,
      material: material || null,
      categoryId,
      isFeatured: !!isFeatured,
      isGift: !!isGift,
      isActive: isActive !== undefined ? !!isActive : true,
    },
  });

  return NextResponse.json({ product });
}
