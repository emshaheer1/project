import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    update: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
    },
    create: {
      email: parsed.data.email.toLowerCase(),
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
    },
  });

  return res.status(201).json({
    ok: true,
    id: subscriber.id,
    message: "You are subscribed. Enjoy free shipping and 10% off your next order.",
  });
});

export default router;
