import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

/** Whole dollars → .99 pricing. Ending in 0 (70, 50) → 69.99 / 49.99; else 74 → 74.99 */
function toNinetyNine(price: number) {
  const whole = Math.floor(Number(price));
  if (whole % 10 === 0) {
    return Math.round((whole - 0.01) * 100) / 100;
  }
  return Math.round((whole + 0.99) * 100) / 100;
}

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { slug: "asc" },
    select: { id: true, slug: true, price: true },
  });

  const priceBySlug = new Map<string, number>();

  for (const p of products) {
    const current = Number(p.price);
    const next = toNinetyNine(current);
    priceBySlug.set(p.slug, next);
    await prisma.product.update({ where: { id: p.id }, data: { price: next } });
    console.log(`${p.slug}: $${current} -> $${next}`);
  }

  const catalogPath = path.resolve(__dirname, "../../scripts/alpha-catalog.json");
  if (fs.existsSync(catalogPath)) {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8")) as Array<{
      slug: string;
      price: number;
    }>;
    for (const item of catalog) {
      item.price = toNinetyNine(item.price);
    }
    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
    console.log(`Updated ${catalogPath}`);
  }

  const seedPath = path.resolve(__dirname, "../prisma/seed.ts");
  let seed = fs.readFileSync(seedPath, "utf8");
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
