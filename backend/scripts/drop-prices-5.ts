import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { slug: "asc" },
    select: { id: true, slug: true, price: true, category: true },
  });

  const updates: Array<{ slug: string; from: number; to: number }> = [];

  for (const p of products) {
    if (p.category === "BAC Water") {
      console.log(`SKIP ${p.slug} (BAC Water) $${p.price}`);
      continue;
    }
    const next = roundMoney(Number(p.price) - 5);
    if (next < 0) throw new Error(`Price would go negative for ${p.slug}`);
    await prisma.product.update({ where: { id: p.id }, data: { price: next } });
    updates.push({ slug: p.slug, from: Number(p.price), to: next });
    console.log(`${p.slug}: $${p.price} -> $${next}`);
  }

  // Sync alpha-catalog.json
  const catalogPath = path.resolve(__dirname, "../../scripts/alpha-catalog.json");
  if (fs.existsSync(catalogPath)) {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8")) as Array<{
      slug: string;
      price: number;
      category: string;
    }>;
    for (const item of catalog) {
      if (item.category === "BAC Water") continue;
      item.price = roundMoney(Number(item.price) - 5);
    }
    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
    console.log(`Updated ${catalogPath}`);
  }

  // Sync seed.ts price literals by slug
  const seedPath = path.resolve(__dirname, "../prisma/seed.ts");
  let seed = fs.readFileSync(seedPath, "utf8");
  const priceBySlug = new Map(updates.map((u) => [u.slug, u.to]));

  // Also keep BAC unchanged; rebuild BB from DB if seed was stale
  const allAfter = await prisma.product.findMany({
    select: { slug: true, price: true, category: true },
  });
  for (const p of allAfter) {
    priceBySlug.set(p.slug, Number(p.price));
  }

  for (const [slug, price] of priceBySlug) {
    const re = new RegExp(
      `(slug:\\s*"${slug}"[\\s\\S]*?price:\\s*)(-?\\d+(?:\\.\\d+)?)`,
      "m",
    );
    if (!re.test(seed)) {
      console.warn(`seed.ts: no match for ${slug}`);
      continue;
    }
    seed = seed.replace(re, `$1${price}`);
  }
  fs.writeFileSync(seedPath, seed);
  console.log(`Updated ${seedPath}`);
  console.log(`Done. Updated ${updates.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
