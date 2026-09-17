"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api<{ message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Account Access"
        title="Forgot password"
        description="Enter the email on your Alpha Polymers account and we’ll send a secure link to set a new password."
      />

      <div className="container-site mt-12 max-w-lg">
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)] md:p-8">
          {done ? (
            <div className="space-y-4">
              <p className="text-sm leading-7 text-[var(--muted)]">
                If that email exists, a reset link was sent. Check your inbox
                (and spam folder). The link expires in one hour.
              </p>
              <p className="text-sm leading-7 text-[var(--muted)]">
                Local development: if email is not configured, the reset link is
                printed in the API server console.
              </p>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link href="/login" className="btn btn-dark w-full sm:w-auto">
                  Back to login
                </Link>
                <button
                  type="button"
                  className="btn btn-outline w-full sm:w-auto"
                  onClick={() => {
                    setDone(false);
                    setEmail("");
                  }}
                >
                  Try another email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <p className="text-sm text-[var(--muted)]">
                We’ll email you a one-time link to choose a new password.
              </p>
              <div>
                <label className="label" htmlFor="forgot-email">
                  Email
                </label>
                <input
                  id="forgot-email"
                  className="field"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
              <button className="btn btn-dark btn-lg w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
              <p className="text-center text-sm text-[var(--muted)]">
                Remembered it?{" "}
                <Link href="/login" className="font-semibold text-[var(--accent)] hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
