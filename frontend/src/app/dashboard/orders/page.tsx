"use client";

import { useCallback, useEffect, useState } from "react";
import { ConfirmClearModal } from "@/components/dashboard/ConfirmClearModal";
import { adminApi, formatPrice } from "@/lib/api";

type OrderRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  user: { id: string; email: string; firstName: string; lastName: string } | null;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
};

function OrderRows({
  order,
  expanded,
  onToggle,
}: {
  order: OrderRow;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr>
        <td className="font-mono text-xs">{order.id.slice(0, 12)}…</td>
        <td className="font-medium text-[var(--navy)]">
          {order.firstName} {order.lastName}
        </td>
        <td>{order.email}</td>
        <td>
          <span className="rounded-md bg-[var(--surface)] px-2 py-1 text-xs font-semibold text-[var(--navy)]">
            {order.status}
          </span>
        </td>
        <td>{order.paymentStatus}</td>
        <td className="font-semibold text-[var(--accent)]">{formatPrice(order.total)}</td>
        <td>{new Date(order.createdAt).toLocaleString()}</td>
        <td>
          <button
            type="button"
            className="text-sm font-semibold text-[var(--accent)] hover:underline"
            onClick={onToggle}
          >
            {expanded ? "Hide" : "Details"}
          </button>
        </td>
      </tr>
      {expanded ? (
        <tr>
          <td colSpan={8} className="!bg-[var(--surface)]">
            <div className="grid gap-4 p-2 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">
                  Shipping address
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--navy)]">
                  {order.firstName} {order.lastName}
                  <br />
                  {order.address1}
                  {order.address2 ? (
                    <>
                      <br />
                      {order.address2}
                    </>
                  ) : null}
                  <br />
                  {order.city}, {order.state} {order.zip}
                  <br />
                  {order.country}
                </p>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Subtotal {formatPrice(order.subtotal)} · Shipping{" "}
                  {formatPrice(order.shipping)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">
                  Line items
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between gap-3 border-b border-[var(--line)] pb-2"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-[var(--navy)]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [clearOpen, setClearOpen] = useState(false);

  const loadOrders = useCallback(() => {
    setLoading(true);
    adminApi<{ orders: OrderRow[] }>("/api/admin/orders")
      .then((data) => {
        setOrders(data.orders);
        setError("");
        setExpanded(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="space-y-6">
      <ConfirmClearModal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onCleared={loadOrders}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Orders</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">All Orders</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Complete order records from the website, including shipping and line items.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm !border-[var(--danger)] !text-[var(--danger)] hover:!bg-[var(--danger)] hover:!text-white hover:!border-transparent"
          onClick={() => setClearOpen(true)}
        >
          Clear
        </button>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]">
        {loading ? (
          <p className="p-6 text-sm text-[var(--muted)]">Loading orders...</p>
        ) : error ? (
          <p className="p-6 text-sm text-[var(--danger)]">{error}</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderRows
                    key={order.id}
                    order={order}
                    expanded={expanded === order.id}
                    onToggle={() =>
                      setExpanded((id) => (id === order.id ? null : order.id))
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
