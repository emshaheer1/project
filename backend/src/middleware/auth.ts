import type { NextFunction, Request, Response } from "express";
import {
  getTokenFromRequest,
  verifyAdminToken,
  verifyToken,
  type AuthPayload,
} from "../lib/auth";
import { prisma } from "../lib/prisma";

export type AuthedRequest = Request & { user?: AuthPayload };

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  // Customer routes must not accept admin-dashboard audience tokens mixed incorrectly;
  // admin tokens still verify under issuer but requireAdmin is the admin gate.
  if (payload.role === "admin") {
    return res.status(403).json({ error: "Use the admin dashboard login" });
  }
  req.user = payload;
  return next();
}

export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload && payload.role !== "admin") req.user = payload;
  }
  return next();
}

export async function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Admin routes only accept short-lived admin-audience JWTs
  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired admin session" });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true },
  });

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  req.user = { userId: user.id, email: user.email, role: user.role };
  return next();
}
