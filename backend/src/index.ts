import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Stripe from "stripe";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import wishlistRoutes from "./routes/wishlist";
import contactRoutes from "./routes/contact";
import newsletterRoutes from "./routes/newsletter";
import adminRoutes from "./routes/admin";
import { prisma } from "./lib/prisma";
import { assertJwtSecretConfigured } from "./lib/auth";

assertJwtSecretConfigured();

const app = express();
const isProd = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 4000;
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

function normalizeOrigin(url: string) {
  return url.trim().replace(/\/+$/, "");
}

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URLS,
    !isProd ? "http://localhost:3000" : null,
    !isProd ? "http://127.0.0.1:3000" : null,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map(normalizeOrigin)
    .filter(Boolean)
);

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin(origin, callback) {
      // Non-browser clients (health checks, curl) have no Origin
      if (!origin) {
        return callback(null, true);
      }
      const normalized = normalizeOrigin(origin);
      if (allowedOrigins.has(normalized)) {
        return callback(null, true);
      }
      // Allow Vercel preview/production URLs when explicitly enabled
      if (
        process.env.FRONTEND_ALLOW_VERCEL === "true" &&
        /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalized)
      ) {
        return callback(null, true);
      }
      console.warn(`CORS blocked origin: ${normalized}`);
      return callback(null, false);
    },
    credentials: true,
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 300 : 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 5 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many admin login attempts. Please try again later." },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 60 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many admin requests. Please try again later." },
});

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isProd ? 10 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

app.use(globalLimiter);

app.post(
  "/api/orders/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(400).json({ error: "Stripe webhook not configured" });
    }

    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") {
      return res.status(400).json({ error: "Missing signature" });
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "confirmed", paymentStatus: "paid" },
          });
        }
      }

      return res.json({ received: true });
    } catch (err) {
      console.error("Stripe webhook verification failed");
      return res.status(400).json({ error: "Invalid webhook signature" });
    }
  }
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "apollo-api" });
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/admin/login", adminLoginLimiter);
app.use("/api/admin/clear", adminLoginLimiter);
app.use("/api/admin", adminLimiter);
app.use("/api/contact", formLimiter);
app.use("/api/newsletter", formLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const message =
    err instanceof Error && err.message === "Not allowed by CORS"
      ? "Not allowed by CORS"
      : "Internal server error";
  const status = message === "Not allowed by CORS" ? 403 : 500;
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Alpha Peptides API listening on http://localhost:${port}`);
});
