"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi, clearAdminSession, hasAdminSession, setAdminToken } from "@/lib/api";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasAdminSession()) return;
    adminApi("/api/admin/me")
      .then(() => router.replace("/dashboard"))
      .catch(() => clearAdminSession());
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await adminApi<{ token: string }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      setAdminToken(data.token);
      setPassword("");
      router.replace("/dashboard");
    } catch (err) {
      setPassword("");
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(145deg,var(--navy-deep),var(--navy-mid))] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-white shadow-[var(--shadow-lg)]">
        <div className="bg-[var(--navy-deep)] px-7 py-6 text-white">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--gold-soft)] uppercase">
            Alpha Peptides
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Admin Login</h1>
          <p className="mt-2 text-sm text-white/60">
            Authorized personnel only. Sessions expire automatically.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 p-7" autoComplete="off">
          <div>
            <label className="label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              className="field"
              type="email"
              name="admin-email"
              required
              autoComplete="username"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              className="field"
              type="password"
              name="admin-password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <button className="btn btn-dark btn-lg w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in to dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
