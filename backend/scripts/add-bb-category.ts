import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const productsDir = path.resolve(process.cwd(), "../frontend/public/products");

async function main() {
  const srcImg =
    [
      path.join(productsDir, "bb10-bpc-tb.png"),
      path.join(productsDir, "bb10.png"),
    ].find((p) => fs.existsSync(p)) ?? null;

  if (!srcImg) throw new Error("BB10 product image not found");

  const bb10Img = path.join(productsDir, "bb10.png");
  const bb20Img = path.join(productsDir, "bb20.png");
  if (srcImg !== bb10Img) fs.copyFileSync(srcImg, bb10Img);
  fs.copyFileSync(srcImg, bb20Img);
  console.log("images ready: bb10.png, bb20.png");

  const old = await prisma.product.findUnique({ where: { slug: "bb10-bpc-tb" } });
  if (old) {
    const clash = await prisma.product.findUnique({ where: { slug: "bb10" } });
    if (clash) {
      await prisma.wishlistItem.deleteMany({ where: { productId: old.id } });
      await prisma.product.delete({ where: { id: old.id } });
      await prisma.product.update({
        where: { slug: "bb10" },
        data: {
          name: "BB10",
          description:
            "BB10 research blend of BPC-157 5mg + TB500 5mg (10mg total) for comparative tissue-pathway studies. For research use only.",
          price: 79.99,
          category: "BB",
          featured: true,
          imageUrl: "/products/bb10.png",
          inStock: true,
        },
      });
    } else {
      await prisma.product.update({
        where: { slug: "bb10-bpc-tb" },
        data: {
          slug: "bb10",
          name: "BB10",
          description:
            "BB10 research blend of BPC-157 5mg + TB500 5mg (10mg total) for comparative tissue-pathway studies. For research use only.",
          price: 79.99,
          category: "BB",
          featured: true,
          imageUrl: "/products/bb10.png",
          inStock: true,
        },
      });
    }
    console.log("BB10 moved to category BB");
  } else {
    await prisma.product.upsert({
      where: { slug: "bb10" },
      update: {
        name: "BB10",
        description:
          "BB10 research blend of BPC-157 5mg + TB500 5mg (10mg total) for comparative tissue-pathway studies. For research use only.",
        price: 79.99,
        category: "BB",
        featured: true,
        imageUrl: "/products/bb10.png",
        inStock: true,
      },
      create: {
        slug: "bb10",
        name: "BB10",
        description:
          "BB10 research blend of BPC-157 5mg + TB500 5mg (10mg total) for comparative tissue-pathway studies. For research use only.",
        price: 79.99,
        category: "BB",
        featured: true,
        imageUrl: "/products/bb10.png",
        inStock: true,
      },
    });
    console.log("BB10 upserted");
  }

  await prisma.product.upsert({
    where: { slug: "bb20" },
    update: {
      name: "BB20",
      description:
        "BB20 research blend of BPC-157 10mg + TB500 10mg (20mg total) for comparative tissue-pathway studies. For research use only.",
      price: 119.99,
      category: "BB",
      featured: true,
      imageUrl: "/products/bb20.png",
      inStock: true,
    },
    create: {
      slug: "bb20",
      name: "BB20",
      description:
        "BB20 research blend of BPC-157 10mg + TB500 10mg (20mg total) for comparative tissue-pathway studies. For research use only.",
      price: 119.99,
      category: "BB",
      featured: true,
      imageUrl: "/products/bb20.png",
      inStock: true,
    },
  });
  console.log("BB20 upserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
