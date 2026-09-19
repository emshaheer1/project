import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword, isStrongAdminPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

const products = [
  {
    slug: "rt5-retatrutide-5mg",
    name: "Retatrutide 5mg",
    description: "Retatrutide (RT5) is a multi-agonist research peptide supplied as lyophilized powder for laboratory metabolic pathway studies. Purity >99%. For research use only.",
    price: 74.99,
    featured: true,
    category: "Retatrutide",
  },
  {
    slug: "rt10-retatrutide-10mg",
    name: "Retatrutide 10mg",
    description: "Retatrutide 10mg research vial for controlled laboratory assays. Lyophilized powder, purity >99%. For research use only.",
    price: 129.99,
    featured: false,
    category: "Retatrutide",
  },
  {
    slug: "rt15-retatrutide-15mg",
    name: "Retatrutide 15mg",
    description: "Retatrutide 15mg for extended research protocols. Laboratory grade lyophilized peptide. For research use only.",
    price: 145.99,
    featured: false,
    category: "Retatrutide",
  },
  {
    slug: "rt20-retatrutide-20mg",
    name: "Retatrutide 20mg",
    description: "Retatrutide 20mg research peptide for metabolic and receptor studies. Purity >99%. For research use only.",
    price: 194.99,
    featured: true,
    category: "Retatrutide",
  },
  {
    slug: "rt30-retatrutide-30mg",
    name: "Retatrutide 30mg",
    description: "Retatrutide 30mg vial for multi-assay laboratory work. Lyophilized powder. For research use only.",
    price: 205.99,
    featured: false,
    category: "Retatrutide",
  },
  {
    slug: "rt40-retatrutide-40mg",
    name: "Retatrutide 40mg",
    description: "Retatrutide 40mg research supply for higher-volume laboratory protocols. For research use only.",
    price: 274.99,
    featured: false,
    category: "Retatrutide",
  },
  {
    slug: "rt50-retatrutide-50mg",
    name: "Retatrutide 50mg",
    description: "Retatrutide 50mg lyophilized research peptide. High-purity material for laboratory use only.",
    price: 324.99,
    featured: false,
    category: "Retatrutide",
  },
  {
    slug: "rt60-retatrutide-60mg",
    name: "Retatrutide 60mg",
    description: "Retatrutide 60mg for extended research programs. Purity >99%. For research use only.",
    price: 304.99,
    featured: false,
    category: "Retatrutide",
  },
  {
    slug: "rt100-retatrutide-100mg",
    name: "Retatrutide 100mg",
    description: "Retatrutide 100mg bulk research vial for laboratory-scale studies. For research use only.",
    price: 494.99,
    featured: false,
    category: "Retatrutide",
  },
  {
    slug: "tr5-tirzepatide-5mg",
    name: "Tirzepatide 5mg",
    description: "Tirzepatide (TR5) research peptide for dual-agonist pathway studies. Lyophilized, purity >99%. For research use only.",
    price: 74.99,
    featured: true,
    category: "Tirzepatide",
  },
  {
    slug: "tr10-tirzepatide-10mg",
    name: "Tirzepatide 10mg",
    description: "Tirzepatide 10mg research vial for laboratory metabolic assays. For research use only.",
    price: 94.99,
    featured: false,
    category: "Tirzepatide",
  },
  {
    slug: "tr15-tirzepatide-15mg",
    name: "Tirzepatide 15mg",
    description: "Tirzepatide 15mg lyophilized peptide for controlled research applications. For research use only.",
    price: 115.99,
    featured: false,
    category: "Tirzepatide",
  },
  {
    slug: "tr20-tirzepatide-20mg",
    name: "Tirzepatide 20mg",
    description: "Tirzepatide 20mg research compound for receptor and metabolic pathway studies. For research use only.",
    price: 144.99,
    featured: true,
    category: "Tirzepatide",
  },
  {
    slug: "tr30-tirzepatide-30mg",
    name: "Tirzepatide 30mg",
    description: "Tirzepatide 30mg for multi-assay laboratory protocols. Purity >99%. For research use only.",
    price: 174.99,
    featured: false,
    category: "Tirzepatide",
  },
  {
    slug: "tr40-tirzepatide-40mg",
    name: "Tirzepatide 40mg",
    description: "Tirzepatide 40mg research supply. Lyophilized powder for laboratory use only.",
    price: 195.99,
    featured: false,
    category: "Tirzepatide",
  },
  {
    slug: "tr50-tirzepatide-50mg",
    name: "Tirzepatide 50mg",
    description: "Tirzepatide 50mg high-quantity research vial. For laboratory research only.",
    price: 245.99,
    featured: false,
    category: "Tirzepatide",
  },
  {
    slug: "glow70-bgc70",
    name: "GLOW70 (BGC70)",
    description: "GLOW70 research blend (TB 10mg + BPC 10mg + GHK-Cu) totaling 70mg. Designed for combination peptide studies. Purity >99%. For research use only.",
    price: 139.99,
    featured: true,
    category: "Peptide Blends",
  },
  {
    slug: "klow80",
    name: "KLOW80",
    description: "KLOW80 research blend combining BPC-157 and GHK-Cu (80mg total) for laboratory investigation. For research use only.",
    price: 129.99,
    featured: true,
    category: "Peptide Blends",
  },
  {
    slug: "bb10",
    name: "BB10",
    description:
      "BB10 research blend of BPC-157 5mg + TB500 5mg (10mg total) for comparative tissue-pathway studies. For research use only.",
    price: 114.99,
    featured: true,
    category: "BB",
  },
  {
    slug: "bb20",
    name: "BB20",
    description:
      "BB20 research blend of BPC-157 10mg + TB500 10mg (20mg total) for comparative tissue-pathway studies. For research use only.",
    price: 154.99,
    featured: true,
    category: "BB",
  },
  {
    slug: "tsm5-tesamorelin-5mg",
    name: "Tesamorelin 5mg",
    description: "Tesamorelin (TSM5) research peptide studied in GHRH pathway models. Lyophilized powder, purity >99%. For research use only.",
    price: 39.99,
    featured: true,
    category: "Tesamorelin",
  },
  {
    slug: "tsm10-tesamorelin-10mg",
    name: "Tesamorelin 10mg",
    description: "Tesamorelin 10mg research vial for laboratory hormone-pathway assays. For research use only.",
    price: 49.99,
    featured: false,
    category: "Tesamorelin",
  },
  {
    slug: "tsm15-tesamorelin-15mg",
    name: "Tesamorelin 15mg",
    description: "Tesamorelin 15mg lyophilized peptide for extended research protocols. For research use only.",
    price: 79.99,
    featured: false,
    category: "Tesamorelin",
  },
  {
    slug: "tsm20-tesamorelin-20mg",
    name: "Tesamorelin 20mg",
    description: "Tesamorelin 20mg research supply for multi-assay laboratory work. For research use only.",
    price: 105.99,
    featured: true,
    category: "Tesamorelin",
  },
  {
    slug: "ms5-mots-c-5mg",
    name: "MOTS-c 5mg",
    description: "MOTS-c (MS5) mitochondrial-derived research peptide for cellular metabolism studies. Purity >99%. For research use only.",
    price: 39.99,
    featured: true,
    category: "MOTS-c",
  },
  {
    slug: "ms10-mots-c-10mg",
    name: "MOTS-c 10mg",
    description: "MOTS-c 10mg research vial for laboratory mitochondrial pathway assays. For research use only.",
    price: 115.99,
    featured: false,
    category: "MOTS-c",
  },
  {
    slug: "ms20-mots-c-20mg",
    name: "MOTS-c 20mg",
    description: "MOTS-c 20mg lyophilized peptide for extended cellular research protocols. For research use only.",
    price: 144.99,
    featured: true,
    category: "MOTS-c",
  },
  {
    slug: "ms40-mots-c-40mg",
    name: "MOTS-c 40mg",
    description: "MOTS-c 40mg high-quantity research supply. For laboratory use only.",
    price: 194.99,
    featured: false,
    category: "MOTS-c",
  },
  {
    slug: "nj500-nad-500mg",
    name: "NAD+ 500mg",
    description: "NAD+ 500mg (NJ500) research-grade nicotinamide adenine dinucleotide for cellular energy and aging studies. For research use only.",
    price: 69.99,
    featured: true,
    category: "NAD+",
  },
  {
    slug: "nj1000-nad-1000mg",
    name: "NAD+ 1000mg",
    description: "NAD+ 1000mg research vial for higher-volume laboratory protocols. Purity >99%. For research use only.",
    price: 94.99,
    featured: true,
    category: "NAD+",
  },
  {
    slug: "bc5-bpc157-5mg",
    name: "BPC-157 5mg",
    description: "BPC-157 5mg research peptide for tissue and gut pathway laboratory studies. Lyophilized powder. For research use only.",
    price: 49.99,
    featured: true,
    category: "BPC-157",
  },
  {
    slug: "bc10-bpc157-10mg",
    name: "BPC-157 10mg",
    description: "BPC-157 10mg research vial widely used in regenerative pathway assays. Purity >99%. For research use only.",
    price: 94.99,
    featured: true,
    category: "BPC-157",
  },
  {
    slug: "bc20-bpc157-20mg",
    name: "BPC-157 20mg",
    description: "BPC-157 20mg lyophilized peptide for multi-assay research programs. For research use only.",
    price: 159.99,
    featured: false,
    category: "BPC-157",
  },
  {
    slug: "cu50-ghk-cu-50mg",
    name: "GHK-Cu 50mg",
    description: "GHK-Cu 50mg copper peptide for regenerative and dermal research models. Purity >99%. For research use only.",
    price: 39.99,
    featured: true,
    category: "GHK-Cu",
  },
  {
    slug: "cu100-ghk-cu-100mg",
    name: "GHK-Cu 100mg",
    description: "GHK-Cu 100mg copper peptide for regenerative and dermal research models. Purity >99%. For research use only.",
    price: 94.99,
    featured: true,
    category: "GHK-Cu",
  },
  {
    slug: "wa3-bac-water-3ml",
    name: "BAC Water 3ml",
    description: "Bacteriostatic water 3ml (WA3) for reconstituting lyophilized research peptides in the lab. For research use only.",
    price: 4.99,
    featured: true,
    category: "BAC Water",
  },
  {
    slug: "wa10-bac-water-10ml",
    name: "BAC Water 10ml",
    description: "Bacteriostatic water 10ml (WA10) reconstitution solution for laboratory peptide preparation. For research use only.",
    price: 9.99,
    featured: true,
    category: "BAC Water",
  },
  {
    slug: "bulk-retatrutide-10mg-10pack",
    name: "Retatrutide 10mg — 10 Pack",
    description:
      "Bulk 10-pack of Retatrutide 10mg research vials for laboratory-scale protocols. Currently sold out. For research use only.",
    price: 1199.99,
    featured: false,
    category: "Bulk",
    inStock: false,
    imageSlug: "rt10-retatrutide-10mg",
  },
  {
    slug: "bulk-tirzepatide-20mg-10pack",
    name: "Tirzepatide 20mg — 10 Pack",
    description:
      "Bulk 10-pack of Tirzepatide 20mg research vials for extended assay programs. Currently sold out. For research use only.",
    price: 1349.99,
    featured: false,
    category: "Bulk",
    inStock: false,
    imageSlug: "tr20-tirzepatide-20mg",
  },
  {
    slug: "bulk-bpc157-10mg-10pack",
    name: "BPC-157 10mg — 10 Pack",
    description:
      "Bulk 10-pack of BPC-157 10mg research vials for multi-assay laboratory work. Currently sold out. For research use only.",
    price: 899.99,
    featured: false,
    category: "Bulk",
    inStock: false,
    imageSlug: "bc10-bpc157-10mg",
  },
];

function productImage(slug: string) {
  return `/products/${slug}.png`;
}

async function main() {
  const keepSlugs = products.map((p) => p.slug);

  await prisma.wishlistItem.deleteMany({
    where: { product: { slug: { notIn: keepSlugs } } },
  });

  const removable = await prisma.product.findMany({
    where: {
      slug: { notIn: keepSlugs },
      orderItems: { none: {} },
    },
    select: { id: true },
  });
  if (removable.length) {
    await prisma.product.deleteMany({
      where: { id: { in: removable.map((p) => p.id) } },
    });
  }

  await prisma.product.updateMany({
    where: { slug: { notIn: keepSlugs } },
    data: { featured: false, inStock: false },
  });

  for (const product of products) {
    const imageSlug =
      "imageSlug" in product && product.imageSlug
        ? product.imageSlug
        : product.slug;
    const imageUrl = productImage(imageSlug);
    const inStock =
      "inStock" in product && typeof product.inStock === "boolean"
        ? product.inStock
        : true;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        // Keep existing DB prices / stock so dashboard edits survive re-seeds
        featured: product.featured,
        category: product.category,
        imageUrl,
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        featured: product.featured,
        category: product.category,
        imageUrl,
        inStock,
      },
    });
  }

  console.log(`Seeded ${products.length} Alpha Polymers catalog products`);

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env before seeding.");
  }

  if (!isStrongAdminPassword(adminPassword)) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters and include uppercase, lowercase, a number, and a special character.");
  }

  const passwordHash = await hashPassword(adminPassword);
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  const resetPassword = process.env.SEED_RESET_ADMIN_PASSWORD === "true";

  if (existing) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: "admin",
        firstName: "Alpha",
        lastName: "Admin",
        ...(resetPassword ? { passwordHash } : {}),
      },
    });
    console.log(
      resetPassword
        ? `Admin updated with new password: ${adminEmail}`
        : `Admin ensured (password unchanged): ${adminEmail}`
    );
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: "Alpha",
        lastName: "Admin",
        role: "admin",
      },
    });
    console.log(`Admin created: ${adminEmail}`);
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
