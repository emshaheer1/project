import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const publicProducts = path.resolve(process.cwd(), "../frontend/public/products");
const oldImg = path.join(publicProducts, "cu1000-ghk-cu-1000mg.png");
const newImg = path.join(publicProducts, "cu100-ghk-cu-100mg.png");

async function main() {
  if (fs.existsSync(oldImg)) {
    if (fs.existsSync(newImg)) fs.unlinkSync(newImg);
    fs.renameSync(oldImg, newImg);
    console.log("renamed image -> cu100-ghk-cu-100mg.png");
  } else if (fs.existsSync(newImg)) {
    console.log("image already named cu100-ghk-cu-100mg.png");
  } else {
    console.warn("warning: GHK-Cu 100mg image file not found");
  }

  await prisma.product.update({
    where: { slug: "cu50-ghk-cu-50mg" },
    data: { price: 45 },
  });
  console.log("cu50-ghk-cu-50mg -> $45");

  const existing100 = await prisma.product.findUnique({
    where: { slug: "cu100-ghk-cu-100mg" },
  });
  const old1000 = await prisma.product.findUnique({
    where: { slug: "cu1000-ghk-cu-1000mg" },
  });

  if (old1000 && !existing100) {
    await prisma.product.update({
      where: { slug: "cu1000-ghk-cu-1000mg" },
      data: {
        slug: "cu100-ghk-cu-100mg",
        name: "GHK-Cu 100mg",
        description:
          "GHK-Cu 100mg copper peptide for regenerative and dermal research models. Purity >99%. For research use only.",
        price: 99,
        imageUrl: "/products/cu100-ghk-cu-100mg.png",
      },
    });
    console.log("cu1000-ghk-cu-1000mg -> cu100-ghk-cu-100mg @ $99");
  } else if (old1000 && existing100) {
    await prisma.wishlistItem.deleteMany({ where: { productId: old1000.id } });
    await prisma.product.delete({ where: { id: old1000.id } });
    await prisma.product.update({
      where: { slug: "cu100-ghk-cu-100mg" },
      data: {
        name: "GHK-Cu 100mg",
        description:
          "GHK-Cu 100mg copper peptide for regenerative and dermal research models. Purity >99%. For research use only.",
        price: 99,
        imageUrl: "/products/cu100-ghk-cu-100mg.png",
      },
    });
    console.log("merged to cu100-ghk-cu-100mg @ $99");
  } else if (existing100) {
    await prisma.product.update({
      where: { slug: "cu100-ghk-cu-100mg" },
      data: {
        name: "GHK-Cu 100mg",
        description:
          "GHK-Cu 100mg copper peptide for regenerative and dermal research models. Purity >99%. For research use only.",
        price: 99,
        imageUrl: "/products/cu100-ghk-cu-100mg.png",
      },
    });
    console.log("cu100-ghk-cu-100mg -> $99");
  } else {
    throw new Error("GHK-Cu 100mg/1000mg product not found");
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
