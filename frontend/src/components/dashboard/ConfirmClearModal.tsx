"use client";

import { useState } from "react";
import { adminApi } from "@/lib/api";

type ConfirmClearModalProps = {
  open: boolean;
  onClose: () => void;
  onCleared: () => void;
};

export function ConfirmClearModal({ open, onClose, onCleared }: ConfirmClearModalProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  function resetAndClose() {
    setPassword("");
    setConfirm("");
    setError("");
    setLoading(false);
    setDone(false);
    onClose();
  }

  async function onConfirm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminApi("/api/admin/clear", {
        method: "POST",
        body: JSON.stringify({ password, confirm }),
      });
      setDone(true);
      onCleared();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(11,31,54,0.55)] p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-modal-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-lg)]">
        {done ? (
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(26,155,176,0.12)] text-[var(--accent)]">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M8 12.5l2.5 2.5L16 9.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 id="clear-modal-title" className="mt-4 text-xl font-semibold text-[var(--navy)]">
              All data is cleared
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Users, orders, and contact requests have been permanently deleted.
            </p>
            <button type="button" className="btn btn-dark mt-6 w-full" onClick={resetAndClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onConfirm} className="p-6">
            <h2 id="clear-modal-title" className="text-xl font-semibold text-[var(--navy)]">
              Confirm clear
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              This permanently deletes all registered users, orders, and contact
              requests from the dashboard. Products and the admin account are kept.
              Enter your admin password to continue.
            </p>
            <div className="mt-5">
              <label className="label">Admin password</label>
              <input
                className="field"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            <div className="mt-4">
              <label className="label">Type DELETE to confirm</label>
              <input
                className="field"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="DELETE"
              />
            </div>
            {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn btn-outline flex-1"
                onClick={resetAndClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-dark flex-1" disabled={loading}>
                {loading ? "Clearing..." : "OK"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
