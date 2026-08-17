import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword, isStrongAdminPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

const products = [
  {
    slug: "tb500-10mg",
    name: "TB500",
    description:
      "TB500 is a synthetic research peptide studied for tissue repair and recovery pathways in laboratory settings. For research use only.",
    price: 59.99,
    featured: true,
    category: "Peptides",
  },
  {
    slug: "ss31-10mg",
    name: "SS31 10mg",
    description:
      "SS-31 (Elamipretide) is a mitochondria-targeting peptide used in cellular research. For laboratory research purposes only.",
    price: 99.99,
    featured: true,
    category: "Peptides",
  },
  {
    slug: "snap-8-2-pack",
    name: "SNAP-8 (2 pack)",
    description:
      "SNAP-8 multi-pack for comparative research assays. Not for human consumption.",
    price: 80.0,
    featured: true,
    category: "Peptides",
  },
  {
    slug: "snap-8",
    name: "SNAP-8",
    description:
      "SNAP-8 is a research peptide studied in relation to neurotransmitter release pathways. For research use only.",
    price: 45.0,
    featured: true,
    category: "Peptides",
  },
  {
    slug: "nad",
    name: "NAD+ 500mg",
    description:
      "Nicotinamide adenine dinucleotide (NAD+) for cellular metabolism and aging research. Laboratory use only.",
    price: 69.99,
    featured: true,
    category: "Peptides",
  },
  {
    slug: "klow-75mg",
    name: "KLOW 75mg",
    description:
      "KLOW blend research compound supplied for laboratory investigation. For research use only.",
    price: 199.99,
    featured: true,
    category: "Peptides",
  },
  {
    slug: "igf-1lr3",
    name: "IGF-1LR3",
    description:
      "IGF-1 LR3 is a long-acting insulin-like growth factor analog for in-vitro research. Not for human use.",
    price: 79.99,
    featured: true,
    category: "Peptides",
  },
  {
    slug: "glp-3r-15mg",
    name: "GLP-3 R 15mg",
    description:
      "GLP-3 R research peptide for metabolic pathway studies. Strictly for laboratory research.",
    price: 150.99,
    featured: true,
    category: "Peptides",
  },
  {
    slug: "glp-3r-10mg",
    name: "GLP-3 R 10mg",
    description:
      "GLP-3 R 10mg vial for controlled research applications. Not for human consumption.",
    price: 135.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "glp-3r-30mg",
    name: "GLP-3 R 30mg",
    description:
      "Higher-quantity GLP-3 R for extended laboratory protocols. Research use only.",
    price: 210.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "glp-3r-60mg",
    name: "GLP-3 R 60mg",
    description:
      "Bulk GLP-3 R supply for research labs. For laboratory use only.",
    price: 309.99,
    featured: false,
    category: "Bulk",
  },
  {
    slug: "glp-2t-30mg",
    name: "GLP-2 T 30mg",
    description:
      "GLP-2 T research peptide for gastrointestinal and metabolic studies. Research only.",
    price: 150.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "glp-2t-20mg-5-pack",
    name: "GLP-2 T 20mg (5 pack)",
    description:
      "Five-pack GLP-2 T 20mg for multi-assay research. Bulk research supply.",
    price: 535.99,
    featured: false,
    category: "Bulk",
  },
  {
    slug: "glp-2-t-20mg",
    name: "GLP-2 T 20mg",
    description:
      "GLP-2 T 20mg vial for laboratory investigation. Not for human consumption.",
    price: 125.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "glp-2t-15mg-4-pack",
    name: "GLP-2 T 15mg (4 pack)",
    description:
      "Four-pack GLP-2 T 15mg for research labs seeking volume pricing.",
    price: 395.99,
    featured: false,
    category: "Bulk",
  },
  {
    slug: "glp-2t-15m",
    name: "GLP-2 T 15mg",
    description:
      "GLP-2 T 15mg research peptide. For laboratory research purposes only.",
    price: 109.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "glp-2t-60mg",
    name: "GLP-2 T 60mg",
    description:
      "GLP-2 T 60mg for extended research protocols. Research use only.",
    price: 259.99,
    featured: false,
    category: "Bulk",
  },
  {
    slug: "glp-1s-5mg",
    name: "GLP-1 S 5mg",
    description:
      "GLP-1 S research compound for metabolic pathway assays. Laboratory use only.",
    price: 79.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "glp-1s-15mg",
    name: "GLP-1 S 15mg",
    description:
      "GLP-1 S 15mg vial for controlled research applications.",
    price: 119.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "glp-1s-10mg",
    name: "GLP-1 S 10mg",
    description:
      "GLP-1 S 10mg research peptide. Not intended for human consumption.",
    price: 99.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "glp-1cglp-1s-5mg",
    name: "GLP-1 C + GLP-1 S",
    description:
      "Combination GLP-1 C and GLP-1 S research blend (5/5mg). For laboratory research only.",
    price: 109.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "ghk-cu-80mg",
    name: "GHK-CU 80mg",
    description:
      "Copper peptide GHK-Cu for regenerative and dermal research models.",
    price: 91.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "ghk-cu",
    name: "GHK-CU 50mg",
    description:
      "GHK-Cu 50mg research peptide. For research use only.",
    price: 50.0,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "fox04-dri-10mg",
    name: "FOX04-DRI",
    description:
      "FOXO4-DRI research peptide studied in cellular senescence models.",
    price: 149.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "epithalon-50mg",
    name: "Epithalon",
    description:
      "Epithalon (Epitalon) for telomere and aging-related laboratory research.",
    price: 139.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "cjc1295-ipamorelin",
    name: "CJC1295/Ipamorelin (No DAC)",
    description:
      "CJC-1295 without DAC combined with Ipamorelin for GHRH pathway research.",
    price: 50.0,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "bpc157-10mg",
    name: "BPC157 10mg",
    description:
      "BPC-157 research peptide for tissue and gut pathway studies. Research only.",
    price: 59.99,
    featured: false,
    category: "Peptides",
  },
  {
    slug: "bacteriostatic-water-reconstitution-solution-10ml",
    name: "Bacteriostatic Water Reconstitution Solution 10ml",
    description:
      "Sterile bacteriostatic water for reconstituting research peptides in the lab.",
    price: 9.99,
    compareAt: 11.99,
    featured: false,
    category: "Accessories",
  },
  {
    slug: "5-amino-5g",
    name: "5 Amino 5mg",
    description:
      "5-Amino-1MQ research compound for metabolic enzyme studies. Laboratory use only.",
    price: 69.99,
    featured: false,
    category: "Peptides",
  },
];

function productImage(slug: string) {
  return `/products/${slug}.png`;
}

async function main() {
  for (const product of products) {
    const imageUrl = productImage(product.slug);
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt ?? null,
        featured: product.featured,
        category: product.category,
        imageUrl,
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt ?? null,
        featured: product.featured,
        category: product.category,
        imageUrl,
        inStock: true,
      },
    });
  }

  console.log(`Seeded ${products.length} products`);

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env before seeding. Do not use default credentials."
    );
  }

  if (!isStrongAdminPassword(adminPassword)) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 12 characters and include uppercase, lowercase, a number, and a special character."
    );
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
