# Samya By Samishtha — E-commerce Website

A full e-commerce storefront + backend admin portal for **Samya By Samishtha**,
a premium artificial & fashion jewellery brand (earrings, bangles, necklaces,
pendants and gifting sets).

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Prisma (SQLite)**.

## Features

**Storefront**
- Premium teal / gold / cream theme matching the brand's hero banner & logo
- Home page: hero, shop-by-category, featured products, gifting banner, Amazon store CTA
- Shop-all page and per-category pages with filters
- Product detail pages with quantity selector, Add to Bag & Buy Now
- Cart (drawer + full page), persisted in the browser
- Checkout flow with `RK20` coupon (20% off), shipping calculation, and order placement
- Order confirmation page
- Fully responsive (mobile, tablet, desktop)

**Admin / Backend Portal** (`/admin`)
- Secure login (JWT session cookie, bcrypt-hashed password)
- Dashboard with revenue, order & product stats
- Product management: create, edit, delete, feature, activate/deactivate
- Category management: create, delete
- Order management: view details, update status (Pending → Confirmed → Shipped → Delivered / Cancelled)

## Getting Started

1. Copy the env file and adjust values:
   ```bash
   cp .env.example .env
   ```
   Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` and a strong `JWT_SECRET`.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database (SQLite) and seed sample products/categories + the admin user:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```
   Storefront: http://localhost:3000
   Admin portal: http://localhost:3000/admin/login (use the credentials from `.env`)

## Notes

- Product photography was not supplied, so product/category images use elegant
  SVG jewellery-motif placeholders in the brand palette. Swap `ProductVisual`
  (`src/components/ProductVisual.tsx`) for real photography by adding an
  `images` field render (product images are already stored on each `Product`
  row as JSON) whenever real photos are available.
- Prices are stored in paise (₹1 = 100) as integers to avoid floating point issues.
- The Amazon storefront link is in `src/lib/site.ts` (`SITE.amazonStoreUrl`).
