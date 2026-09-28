import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Earrings",
    slug: "earrings",
    description: "Studs, jhumkas & drops for everyday glam to festive statements.",
    sortOrder: 1,
  },
  {
    name: "Bangles",
    slug: "bangles",
    description: "Kada, cuffs & bangle sets in gold-tone and kundan finishes.",
    sortOrder: 2,
  },
  {
    name: "Necklace",
    slug: "necklace",
    description: "Chokers, layered chains & statement necklaces.",
    sortOrder: 3,
  },
  {
    name: "Pendants",
    slug: "pendants",
    description: "Delicate pendants to wear alone or layer with chains.",
    sortOrder: 4,
  },
  {
    name: "Gifting",
    slug: "gifting",
    description: "Curated jewellery gift sets for every occasion.",
    sortOrder: 5,
  },
];

const productsByCategory: Record<
  string,
  { name: string; price: number; compareAtPrice?: number; material: string; desc: string }[]
> = {
  earrings: [
    { name: "Meera Kundan Jhumka", price: 89900, compareAtPrice: 129900, material: "Gold-plated brass, Kundan & pearl", desc: "Handcrafted kundan jhumkas with delicate pearl drops — a festive staple that pairs beautifully with silk sarees and lehengas." },
    { name: "Anaya Pearl Studs", price: 49900, compareAtPrice: 69900, material: "Gold-plated brass, freshwater pearl", desc: "Minimal everyday studs finished with a lustrous freshwater pearl for that quiet, everyday elegance." },
    { name: "Zoya Emerald Drop Earrings", price: 109900, compareAtPrice: 154900, material: "Gold-plated brass, emerald-green stone, CZ", desc: "Emerald-hued stones set in a gold vine design — a showstopper for evening wear." },
    { name: "Kiara Chandbali", price: 129900, compareAtPrice: 179900, material: "Gold-plated brass, Kundan, pearl beads", desc: "Traditional chandbali silhouette reimagined with kundan work and dangling pearl beads." },
    { name: "Ira Floral Studs", price: 39900, material: "Gold-plated brass, enamel", desc: "Petite enamel floral studs for a fresh, everyday pop of colour." },
    { name: "Nisha Kundan Hoops", price: 74900, compareAtPrice: 99900, material: "Gold-plated brass, Kundan", desc: "Statement hoops lined edge-to-edge with kundan stones." },
  ],
  bangles: [
    { name: "Radiance Kada Set of 2", price: 149900, compareAtPrice: 199900, material: "Gold-plated brass, CZ stones", desc: "A pair of intricately carved kadas that make a bold traditional statement." },
    { name: "Pearl Charm Bangle", price: 84900, material: "Gold-plated brass, pearl, emerald bead", desc: "Delicate charm bangle with pearl and emerald bead accents, perfect for stacking." },
    { name: "Heritage Kundan Bangle Set", price: 219900, compareAtPrice: 289900, material: "Gold-plated brass, Kundan, pearl (set of 4)", desc: "A set of four kundan bangles inspired by heirloom bridal jewellery." },
    { name: "Aria Everyday Cuff", price: 59900, material: "Gold-plated brass", desc: "Sleek, adjustable open cuff — an easy everyday accent for any wrist stack." },
  ],
  necklace: [
    { name: "Samiya Kundan Choker", price: 249900, compareAtPrice: 329900, material: "Gold-plated brass, Kundan, emerald & pearl", desc: "A regal kundan choker with emerald accents — the centrepiece of any festive look, styled after our signature Raksha Bandhan set." },
    { name: "Layla Layered Chain Necklace", price: 94900, material: "Gold-plated brass", desc: "Triple-layered fine chains for an effortlessly elegant everyday drape." },
    { name: "Devika Bridal Necklace Set", price: 349900, compareAtPrice: 449900, material: "Gold-plated brass, Kundan, pearl (necklace + earrings)", desc: "A complete bridal set — necklace and matching earrings dripping in kundan and pearl." },
    { name: "Sana Coin Necklace", price: 69900, material: "Gold-plated brass", desc: "A delicate coin-pendant chain that layers effortlessly with pendants." },
  ],
  pendants: [
    { name: "Emerald Teardrop Pendant", price: 59900, compareAtPrice: 79900, material: "Gold-plated brass, emerald-green stone, CZ halo", desc: "Inspired by our signature emerald teardrop design — a timeless pendant that elevates any chain." },
    { name: "Om Kundan Pendant", price: 44900, material: "Gold-plated brass, Kundan", desc: "A dainty Om pendant finished with kundan detailing, for everyday grace." },
    { name: "Initial Charm Pendant", price: 34900, material: "Gold-plated brass", desc: "Personalise your layer with a delicate initial charm pendant." },
    { name: "Lotus Pearl Pendant", price: 49900, material: "Gold-plated brass, pearl", desc: "A lotus-inspired pendant with a single pearl centre, symbolising grace." },
  ],
  gifting: [
    { name: "Rakhi Special Jewellery Gift Box", price: 179900, compareAtPrice: 224900, material: "Necklace, earrings & bangle set", desc: "Our Raksha Bandhan special gift box — necklace, earring and bangle trio packed in a keepsake box. Use code RK20 for flat 20% off." },
    { name: "Bridesmaid Earring Gift Set (Set of 3)", price: 129900, material: "3 pairs of stud earrings", desc: "Three coordinated stud pairs, beautifully boxed — a thoughtful gift for your bridal squad." },
    { name: "Festive Jewellery Hamper", price: 159900, compareAtPrice: 199900, material: "Necklace, earrings & pendant", desc: "A festive hamper curated for Diwali, Karwa Chauth and every celebration in between." },
    { name: "Mom's Favourite Pearl Set", price: 109900, material: "Necklace & earrings", desc: "Classic pearl necklace and earring duo, gift-boxed for the woman who raised you." },
  ],
};

async function main() {
  console.log("Seeding database...");

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: cat,
    });

    const products = productsByCategory[cat.slug] ?? [];
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const slug = `${cat.slug}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
      const sku = `SBS-${cat.slug.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(3, "0")}`;
      await prisma.product.upsert({
        where: { slug },
        update: {},
        create: {
          name: p.name,
          slug,
          description: p.desc,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          images: JSON.stringify([cat.slug]),
          sku,
          stock: 25 + i * 3,
          material: p.material,
          isFeatured: i < 2,
          isGift: cat.slug === "gifting",
          categoryId: category.id,
        },
      });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@samyabysamishtha.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Samya@2026";
  const hashed = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: hashed },
    create: {
      email: adminEmail,
      password: hashed,
      name: "Samishtha",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
