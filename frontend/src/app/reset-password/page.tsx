"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing a token. Request a new link.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setDone(true);
      window.setTimeout(() => router.push("/login"), 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)] md:p-8">
      {!token ? (
        <div className="space-y-4">
          <p className="text-sm leading-7 text-[var(--muted)]">
            This page needs a valid reset token from your email link.
          </p>
          <Link href="/forgot-password" className="btn btn-dark">
            Request a new link
          </Link>
        </div>
      ) : done ? (
        <div className="space-y-4">
          <p className="text-sm leading-7 text-[var(--muted)]">
            Password updated. Redirecting you to login…
          </p>
          <Link href="/login" className="btn btn-dark">
            Sign in now
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <p className="text-sm text-[var(--muted)]">
            Choose a new password (at least 8 characters, with letters and numbers).
          </p>
          <div>
            <label className="label" htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              className="field"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="confirm-password">
              Confirm password
            </label>
            <input
              id="confirm-password"
              className="field"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <button className="btn btn-dark btn-lg w-full" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </button>
          <p className="text-center text-sm text-[var(--muted)]">
            <Link href="/login" className="font-semibold text-[var(--accent)] hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Account Access"
        title="Reset password"
        description="Set a new password for your Alpha Polymers account using the secure link from your email."
      />
      <div className="container-site mt-12 max-w-lg">
        <Suspense
          fallback={
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-8 text-sm text-[var(--muted)]">
              Loading…
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
