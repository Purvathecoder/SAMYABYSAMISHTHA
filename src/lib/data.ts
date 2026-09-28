import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductsByCategory(slug: string) {
  return prisma.product.findMany({
    where: { isActive: true, category: { slug } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getGiftProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isGift: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}
