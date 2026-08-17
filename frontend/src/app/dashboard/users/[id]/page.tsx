"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi, formatPrice } from "@/lib/api";

type UserDetail = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  orders: Array<{
    id: string;
    status: string;
    paymentStatus: string;
    total: number;
    createdAt: string;
    items: Array<{ name: string; quantity: number; price: number }>;
  }>;
  wishlist: Array<{
    product: { id: string; name: string; slug: string; price: number };
  }>;
};

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    adminApi<{ user: UserDetail }>(`/api/admin/users/${params.id}`)
      .then((data) => setUser(data.user))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [params.id]);

  if (error) {
    return <p className="text-sm text-[var(--danger)]">{error}</p>;
  }

  if (!user) {
    return <p className="text-sm text-[var(--muted)]">Loading user details...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">User details</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">
            {user.firstName} {user.lastName}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
        </div>
        <Link href="/dashboard/users/details" className="btn btn-outline btn-sm">
          Back to details list
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["User ID", user.id],
          ["Role", user.role],
          ["Registered", new Date(user.createdAt).toLocaleString()],
          ["Updated", new Date(user.updatedAt).toLocaleString()],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-sm)]"
          >
            <p className="text-[10px] font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
              {label}
            </p>
            <p className="mt-2 break-all text-sm font-medium text-[var(--navy)]">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-semibold text-[var(--navy)]">Orders ({user.orders.length})</h2>
        </div>
        {user.orders.length === 0 ? (
          <p className="p-5 text-sm text-[var(--muted)]">No orders for this user.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {user.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-xs">
                      <Link href="/dashboard/orders" className="text-[var(--accent)] hover:underline">
                        {order.id.slice(0, 10)}…
                      </Link>
                    </td>
                    <td>{order.status}</td>
                    <td>{order.paymentStatus}</td>
                    <td>
                      {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                    </td>
                    <td className="font-semibold text-[var(--accent)]">
                      {formatPrice(order.total)}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-semibold text-[var(--navy)]">
            Wishlist ({user.wishlist.length})
          </h2>
        </div>
        {user.wishlist.length === 0 ? (
          <p className="p-5 text-sm text-[var(--muted)]">Wishlist is empty.</p>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {user.wishlist.map((item) => (
              <li key={item.product.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="font-medium text-[var(--navy)]">{item.product.name}</span>
                <span className="text-[var(--accent)] font-semibold">
                  {formatPrice(item.product.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
