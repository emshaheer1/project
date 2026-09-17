import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates: Array<[string, number]> = [
  ["bc5-bpc157-5mg", 55],
  ["bc10-bpc157-10mg", 99],
  ["bc20-bpc157-20mg", 164],
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
