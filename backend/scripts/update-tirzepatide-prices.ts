import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates: Array<[string, number]> = [
  ["tr5-tirzepatide-5mg", 79],
  ["tr10-tirzepatide-10mg", 99],
  ["tr15-tirzepatide-15mg", 120],
  ["tr20-tirzepatide-20mg", 149],
  ["tr30-tirzepatide-30mg", 179],
  ["tr40-tirzepatide-40mg", 200],
  ["tr50-tirzepatide-50mg", 250],
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
