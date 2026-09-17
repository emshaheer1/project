import { Router } from "express";
import { prisma } from "../lib/prisma";
import { sortProductsByDose } from "../lib/productSort";

const router = Router();

router.get("/", async (req, res) => {
  const sort = String(req.query.sort || "default");
  const search = String(req.query.search || "").trim();
  const featured = req.query.featured === "true";
  const category = String(req.query.category || "").trim();

  const where: {
    featured?: boolean;
    category?: string;
    OR?: Array<{ name: { contains: string } } | { description: { contains: string } }>;
  } = {};

  if (featured) where.featured = true;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  let orderBy: Record<string, "asc" | "desc"> | undefined = { name: "asc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "latest") orderBy = { createdAt: "desc" };
  if (sort === "name") orderBy = { name: "asc" };
  if (sort === "default") orderBy = undefined;

  const products = await prisma.product.findMany({
    where,
    ...(orderBy ? { orderBy } : {}),
  });

  const sorted =
    sort === "default" || !orderBy ? sortProductsByDose(products) : products;

  return res.json({ products: sorted, count: sorted.length });
});

router.get("/:slug", async (req, res) => {
  const slug = String(req.params.slug);
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const related = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
  });

  return res.json({
    product,
    related: sortProductsByDose(related).slice(0, 4),
  });
});

export default router;
