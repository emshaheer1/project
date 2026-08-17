"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function NewsletterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await api<{ message: string }>("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email, firstName, lastName }),
      });
      setMessage(data.message);
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
      <div>
        <label className="label !text-white/55">First</label>
        <input
          className="field !border-white/15 !bg-white/10 !text-white placeholder:!text-white/35"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label className="label !text-white/55">Last</label>
        <input
          className="field !border-white/15 !bg-white/10 !text-white placeholder:!text-white/35"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <label className="label !text-white/55">Email</label>
        <input
          className="field !border-white/15 !bg-white/10 !text-white placeholder:!text-white/35"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="btn btn-primary md:col-span-2" disabled={loading}>
        {loading ? "Submitting..." : "Join Newsletter"}
      </button>
      {message ? <p className="md:col-span-2 text-sm text-[var(--accent-soft)]">{message}</p> : null}
      {error ? <p className="md:col-span-2 text-sm text-red-300">{error}</p> : null}
    </form>
  );
}
