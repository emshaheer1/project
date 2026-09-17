import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates: Array<[string, number]> = [
  ["ms5-mots-c-5mg", 45],
  ["ms10-mots-c-10mg", 120],
  ["ms20-mots-c-20mg", 149],
  ["ms40-mots-c-40mg", 199],
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
