import { Router } from "express";
import { z } from "zod";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import { optionalAuth, requireAuth, type AuthedRequest } from "../middleware/auth";

const router = Router();

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

const orderSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().default("US"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        quantity: z.number().int().positive().max(20),
      })
    )
    .min(1)
    .max(30),
});

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ orders });
});

router.post("/", optionalAuth, async (req: AuthedRequest, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid order data", details: parsed.error.flatten() });
  }

  const data = parsed.data;
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    return res.status(400).json({ error: "One or more products are invalid" });
  }

  const unavailable = products.find((p) => !p.inStock);
  if (unavailable) {
    return res.status(400).json({ error: `${unavailable.name} is currently unavailable` });
  }

  const allowDemoCheckout =
    process.env.NODE_ENV !== "production" || process.env.ALLOW_DEMO_CHECKOUT === "true";

  if (!stripe && !allowDemoCheckout) {
    return res.status(503).json({
      error: "Checkout is temporarily unavailable. Payment processing is not configured.",
    });
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  let subtotal = 0;
  const lineItems = data.items.map((item) => {
    const product = productMap.get(item.productId)!;
    subtotal += product.price * item.quantity;
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  subtotal = Math.round(subtotal * 100) / 100;
  const shipping = subtotal >= 200 ? 0 : 9.99;
  const total = Math.round((subtotal + shipping) * 100) / 100;

  const order = await prisma.order.create({
    data: {
      userId: req.user?.userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      subtotal,
      shipping,
      total,
      status: "pending",
      paymentStatus: stripe ? "unpaid" : "demo_paid",
      items: { create: lineItems },
    },
    include: { items: true },
  });

  if (stripe) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      line_items: lineItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.price * 100),
          product_data: { name: item.name },
        },
      })),
      shipping_options:
        shipping > 0
          ? [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: Math.round(shipping * 100), currency: "usd" },
                  display_name: "USPS Priority",
                },
              },
            ]
          : [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: 0, currency: "usd" },
                  display_name: "Free Shipping (orders over $200)",
                },
              },
            ],
      success_url: `${frontendUrl}/checkout/success?orderId=${order.id}`,
      cancel_url: `${frontendUrl}/checkout?canceled=1`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return res.status(201).json({
      order,
      checkoutUrl: session.url,
      demo: false,
    });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "confirmed", paymentStatus: "demo_paid" },
  });

  return res.status(201).json({
    order: { ...order, status: "confirmed", paymentStatus: "demo_paid" },
    checkoutUrl: null,
    demo: true,
  });
});

export default router;
