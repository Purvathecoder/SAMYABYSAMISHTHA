import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminApi";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;

  const body = await req.json();
  const { name, description, sortOrder } = body;
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  let slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const category = await prisma.category.create({
    data: { name, slug, description: description || null, sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0 },
  });
  return NextResponse.json({ category });
}
