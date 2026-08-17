import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signAdminToken, verifyPassword } from "../lib/auth";
import { requireAdmin, type AuthedRequest } from "../middleware/auth";

const router = Router();

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid login data" });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Constant-style failure message — never reveal whether the email exists
  if (!user || user.role !== "admin") {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  const token = signAdminToken({
    userId: user.id,
    email: user.email,
    role: "admin",
  });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

router.post("/logout", requireAdmin, async (_req, res) => {
  return res.json({ ok: true });
});

router.get("/me", requireAdmin, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  return res.json({ user });
});

router.get("/stats", requireAdmin, async (_req, res) => {
  const [users, orders, contacts, revenue] = await Promise.all([
    prisma.user.count({ where: { role: "customer" } }),
    prisma.order.count(),
    prisma.contactMessage.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  return res.json({
    stats: {
      users,
      orders,
      contacts,
      revenue: revenue._sum.total || 0,
    },
  });
});

router.get("/users", requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    where: { role: "customer" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true, wishlist: true } },
    },
  });
  return res.json({ users });
});

router.get("/users/:id", requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
      wishlist: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, price: true, imageUrl: true },
          },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ user });
});

router.get("/orders", requireAdmin, async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: {
        select: { id: true, email: true, firstName: true, lastName: true },
      },
    },
  });
  return res.json({ orders });
});

router.get("/orders/:id", requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: {
        select: { id: true, email: true, firstName: true, lastName: true },
      },
    },
  });
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  return res.json({ order });
});

router.get("/contacts", requireAdmin, async (_req, res) => {
  const contacts = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return res.json({ contacts });
});

const clearSchema = z.object({
  password: z.string().min(1).max(128),
  confirm: z.literal("DELETE"),
});

router.post("/clear", requireAdmin, async (req: AuthedRequest, res) => {
  const parsed = clearSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Password and confirmation are required. Type DELETE to confirm.",
    });
  }

  const admin = await prisma.user.findUnique({
    where: { id: req.user!.userId },
  });
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  const ok = await verifyPassword(parsed.data.password, admin.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Incorrect admin password" });
  }

  await prisma.$transaction([
    prisma.orderItem.deleteMany({}),
    prisma.order.deleteMany({}),
    prisma.wishlistItem.deleteMany({}),
    prisma.user.deleteMany({ where: { role: "customer" } }),
    prisma.contactMessage.deleteMany({}),
  ]);

  return res.json({
    message: "All data is cleared",
    cleared: true,
  });
});

export default router;
