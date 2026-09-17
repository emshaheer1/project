import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates: Array<[string, number]> = [
  ["nj500-nad-500mg", 75],
  ["nj1000-nad-1000mg", 99],
];

async function main() {
  for (const [slug, price] of updates) {
    await prisma.product.update({ where: { slug }, data: { price } });
    console.log(`${slug} -> $${price}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
