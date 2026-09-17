import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates: Array<[string, number]> = [
  ["tsm5-tesamorelin-5mg", 45],
  ["tsm10-tesamorelin-10mg", 55],
  ["tsm15-tesamorelin-15mg", 85],
  ["tsm20-tesamorelin-20mg", 110],
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
