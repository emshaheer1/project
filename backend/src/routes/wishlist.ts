import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, type AuthedRequest } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.user!.userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ items });
});

router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const schema = z.object({ productId: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "productId is required" });
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
  });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const item = await prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId: req.user!.userId,
        productId: parsed.data.productId,
      },
    },
    update: {},
    create: {
      userId: req.user!.userId,
      productId: parsed.data.productId,
    },
    include: { product: true },
  });

  return res.status(201).json({ item });
});

router.delete("/:productId", requireAuth, async (req: AuthedRequest, res) => {
  const productId = String(req.params.productId);
  await prisma.wishlistItem.deleteMany({
    where: {
      userId: req.user!.userId,
      productId,
    },
  });
  return res.json({ ok: true });
});

export default router;
