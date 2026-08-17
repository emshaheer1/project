import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request } from "express";

const isProd = process.env.NODE_ENV === "production";
const JWT_ISSUER = "alpha-peptides-api";
const ADMIN_AUDIENCE = "admin-dashboard";

const WEAK_SECRET_MARKERS = [
  "dev-secret",
  "change-me",
  "change-in-production",
  "apollo-local",
  "replace-with",
  "your-secret",
  "secret123",
];

function isWeakSecret(secret: string) {
  const lower = secret.toLowerCase();
  return (
    secret.length < 32 ||
    WEAK_SECRET_MARKERS.some((marker) => lower.includes(marker))
  );
}

export function assertJwtSecretConfigured() {
  const secret = process.env.JWT_SECRET;
  if (isProd && (!secret || isWeakSecret(secret))) {
    throw new Error(
      "JWT_SECRET must be set to a strong random value (32+ characters) in production."
    );
  }
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (isProd) {
      throw new Error("JWT_SECRET is not configured");
    }
    // Dev-only fallback — never used in production
    return "local-dev-only-jwt-secret-do-not-use-in-prod-32b";
  }
  if (isProd && isWeakSecret(secret)) {
    throw new Error("JWT_SECRET is too weak for production");
  }
  return secret;
}

export type AuthPayload = {
  userId: string;
  email: string;
  role?: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, isProd ? 12 : 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: isProd ? "12h" : "7d",
    issuer: JWT_ISSUER,
  });
}

/** Short-lived admin dashboard tokens with a dedicated audience claim. */
export function signAdminToken(payload: AuthPayload) {
  return jwt.sign(
    { ...payload, role: "admin" },
    getJwtSecret(),
    {
      expiresIn: isProd ? "2h" : "8h",
      issuer: JWT_ISSUER,
      audience: ADMIN_AUDIENCE,
    }
  );
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, getJwtSecret(), {
      issuer: JWT_ISSUER,
    }) as AuthPayload;
  } catch {
    return null;
  }
}

export function verifyAdminToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, getJwtSecret(), {
      issuer: JWT_ISSUER,
      audience: ADMIN_AUDIENCE,
    }) as AuthPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  return cookies?.apollo_admin || cookies?.token || null;
}

/** Customer registration password rule */
export function isStrongPassword(password: string) {
  if (password.length < 8) return false;
  if (!/[A-Za-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

/** Admin seed / credential password rule */
export function isStrongAdminPassword(password: string) {
  if (password.length < 12) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  const lower = password.toLowerCase();
  const bannedExact = new Set([
    "admin123",
    "password",
    "password123",
    "changeme",
    "changethis",
    "changethisadminpass1",
    "changethisadminpass1!",
  ]);
  if (bannedExact.has(lower)) return false;
  return true;
}
