"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { api } from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await api<{ message: string }>("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setMessage(data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Questions about research products, bulk orders, shipping, or your account? Send a message and our team will respond promptly."
      />

      <div className="container-site mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)]">
            <p className="eyebrow">Direct contact</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--navy)]">
              We’re here to help
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Reach out for product documentation, order support, or institutional
              purchasing inquiries.
            </p>

            <div className="mt-6 space-y-5 text-sm leading-7 text-[var(--muted)]">
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] text-[var(--navy)] uppercase">
                  Email
                </p>
                <a
                  href="mailto:support@apollopeptides.co"
                  className="mt-1 inline-block font-semibold text-[var(--accent)] hover:underline"
                >
                  support@apollopeptides.co
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] text-[var(--navy)] uppercase">
                  Address
                </p>
                <p className="mt-1">
                  Alpha Peptides LLC
                  <br />
                  1000 Town Center Drive, Suite 300 #1043
                  <br />
                  Oxnard CA 93036
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link href="/faqs" className="btn btn-outline w-full">
                View FAQs
              </Link>
              <Link href="/shipping" className="btn btn-outline w-full">
                Shipping info
              </Link>
            </div>

            <div className="mt-7 rounded-[var(--radius)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
              Typical response during business hours
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
              Send a Message
            </h2>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)] md:p-8"
          >
            {(
              [
                ["name", "Name", "text"],
                ["email", "Email", "email"],
                ["subject", "Subject", "text"],
              ] as const
            ).map(([key, label, type]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  className="field"
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <label className="label">Message</label>
              <textarea
                className="field min-h-40"
                required
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              />
            </div>
            {message ? <p className="text-sm text-[var(--success)]">{message}</p> : null}
            {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
            <button className="btn btn-dark btn-lg" disabled={loading}>
              {loading ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
