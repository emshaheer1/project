"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi, formatPrice } from "@/lib/api";

type Stats = {
  users: number;
  orders: number;
  contacts: number;
  revenue: number;
};

export default function DashboardHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi<{ stats: Stats }>("/api/admin/stats")
      .then((data) => setStats(data.stats))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, []);

  const cards = [
    { label: "Registered Users", value: stats?.users ?? "—", href: "/dashboard/users" },
    { label: "Total Orders", value: stats?.orders ?? "—", href: "/dashboard/orders" },
    { label: "Contact Requests", value: stats?.contacts ?? "—", href: "/dashboard/contacts" },
    {
      label: "Order Revenue",
      value: stats ? formatPrice(stats.revenue) : "—",
      href: "/dashboard/orders",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Overview</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Monitor store activity across users, orders, and support messages.
        </p>
      </div>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]"
          >
            <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--navy)]">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Users",
            text: "View registered customers and open detailed profiles.",
            href: "/dashboard/users",
          },
          {
            title: "Orders",
            text: "Review every storefront order with shipping and line items.",
            href: "/dashboard/orders",
          },
          {
            title: "Contact Us",
            text: "Read incoming contact form requests from the website.",
            href: "/dashboard/contacts",
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)]"
          >
            <h2 className="text-lg font-semibold text-[var(--navy)]">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.text}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-[var(--accent)]">
              Open →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
