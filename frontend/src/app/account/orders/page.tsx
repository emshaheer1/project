"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BackLink } from "@/components/BackButton";
import { PageHero } from "@/components/PageHero";
import { useAuth } from "@/context/AuthContext";
import { api, formatPrice, type Order } from "@/lib/api";

export default function OrderHistoryPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    api<{ orders: Order[] }>("/api/orders")
      .then((data) => {
        setOrders(data.orders);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setFetching(false));
  }, [user]);

  if (loading) {
    return (
      <div className="container-site py-16 text-[var(--muted)]">Loading orders...</div>
    );
  }

  if (!user) {
    return (
      <div className="container-site py-16 text-center">
        <h1 className="section-title">Order History</h1>
        <p className="mt-3 text-[var(--muted)]">Please log in to view your orders.</p>
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
        title="Order History"
        description="Review every order you have placed, including items, totals, and payment status."
      />

      <div className="container-site mt-6">
        <BackLink href="/account" label="Back to account" />
      </div>

      <div className="container-site mt-8">
        {fetching ? (
          <p className="text-[var(--muted)]">Loading your orders...</p>
        ) : null}
        {error ? <p className="text-[var(--danger)]">{error}</p> : null}

        {!fetching && !error && !orders.length ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-10 text-center shadow-[var(--shadow-sm)]">
            <p className="font-semibold text-[var(--navy)]">No orders yet</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              When you complete a checkout, your orders will appear here.
            </p>
            <Link href="/shop" className="btn btn-dark mt-6 inline-flex">
              Browse products
            </Link>
          </div>
        ) : null}

        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-sm)] md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <h2 className="mt-1 font-semibold text-[var(--navy)]">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)] break-all">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[var(--accent)]">
                    {formatPrice(order.total)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)] capitalize">
                    {order.status} · {order.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto rounded-[var(--radius)] border border-[var(--line)]">
                <table className="w-full min-w-[320px] text-left text-sm">
                  <thead className="bg-[var(--surface)] text-[10px] tracking-[0.12em] text-[var(--muted)] uppercase">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Item</th>
                      <th className="px-3 py-2 font-semibold">Qty</th>
                      <th className="px-3 py-2 font-semibold">Price</th>
                      <th className="px-3 py-2 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-t border-[var(--line)]">
                        <td className="px-3 py-2.5 text-[var(--navy)]">{item.name}</td>
                        <td className="px-3 py-2.5 text-[var(--muted)]">{item.quantity}</td>
                        <td className="px-3 py-2.5 text-[var(--muted)]">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-[var(--navy)]">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                <span>Subtotal: {formatPrice(order.subtotal)}</span>
                <span>Shipping: {formatPrice(order.shipping)}</span>
                <span className="font-medium text-[var(--navy)]">
                  Total: {formatPrice(order.total)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
