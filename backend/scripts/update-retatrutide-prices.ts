import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates: Array<[string, number]> = [
  ["rt5-retatrutide-5mg", 79],
  ["rt10-retatrutide-10mg", 135],
  ["rt15-retatrutide-15mg", 150],
  ["rt20-retatrutide-20mg", 199],
  ["rt30-retatrutide-30mg", 210],
  ["rt60-retatrutide-60mg", 309],
  ["rt100-retatrutide-100mg", 499],
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
