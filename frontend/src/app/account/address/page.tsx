"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BackLink } from "@/components/BackButton";
import { PageHero } from "@/components/PageHero";
import { useAuth } from "@/context/AuthContext";
import { api, type User } from "@/lib/api";

type AddressForm = {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

function emptyForm(user: User | null): AddressForm {
  return {
    address1: user?.address1 || "",
    address2: user?.address2 || "",
    city: user?.city || "",
    state: user?.state || "",
    zip: user?.zip || "",
    country: user?.country || "US",
  };
}

export default function AddressPage() {
  const { user, loading, setUser } = useAuth();
  const [form, setForm] = useState<AddressForm>(emptyForm(null));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setForm(emptyForm(user));
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const data = await api<{ user: User }>("/api/auth/address", {
        method: "PUT",
        body: JSON.stringify({
          address1: form.address1.trim(),
          address2: form.address2.trim() || null,
          city: form.city.trim(),
          state: form.state.trim(),
          zip: form.zip.trim(),
          country: form.country.trim() || "US",
        }),
      });
      setUser(data.user);
      setMessage("Address saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container-site py-16 text-[var(--muted)]">Loading address...</div>
    );
  }

  if (!user) {
    return (
      <div className="container-site py-16 text-center">
        <h1 className="section-title">Saved Address</h1>
        <p className="mt-3 text-[var(--muted)]">Please log in to manage your address.</p>
        <Link href="/login" className="btn btn-dark mt-6 inline-flex">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Account"
        title="Shipping Address"
        description="Save your delivery address so checkout is faster next time."
      />

      <div className="container-site mt-6">
        <BackLink href="/account" label="Back to account" />
      </div>

      <div className="container-site mt-8 max-w-2xl">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-sm)]"
        >
          <div>
            <label className="label">Street address</label>
            <input
              className="field"
              required
              value={form.address1}
              onChange={(e) => setForm((f) => ({ ...f, address1: e.target.value }))}
              placeholder="123 Research Ave"
            />
          </div>
          <div>
            <label className="label">Apartment, suite, etc. (optional)</label>
            <input
              className="field"
              value={form.address2}
              onChange={(e) => setForm((f) => ({ ...f, address2: e.target.value }))}
              placeholder="Suite 200"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">City</label>
              <input
                className="field"
                required
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">State</label>
              <input
                className="field"
                required
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">ZIP / Postal code</label>
              <input
                className="field"
                required
                value={form.zip}
                onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input
                className="field"
                required
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              />
            </div>
          </div>

          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="btn btn-dark" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save address"}
            </button>
            <Link href="/wishlist" className="btn btn-outline">
              View wishlist
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
