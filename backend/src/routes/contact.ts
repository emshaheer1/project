import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/", async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    subject: z.string().min(1),
    message: z.string().min(5),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid contact form", details: parsed.error.flatten() });
  }

  const message = await prisma.contactMessage.create({ data: parsed.data });
  return res.status(201).json({
    ok: true,
    id: message.id,
    message: "Thanks — we received your message and will reply soon.",
  });
});

export default router;
