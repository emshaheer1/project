"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmClearModal } from "@/components/dashboard/ConfirmClearModal";
import { adminApi } from "@/lib/api";

type UserRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  _count: { orders: number; wishlist: number };
};

export default function UserDetailsListPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [clearOpen, setClearOpen] = useState(false);

  const loadUsers = useCallback(() => {
    setLoading(true);
    adminApi<{ users: UserRow[] }>("/api/admin/users")
      .then((data) => {
        setUsers(data.users);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="space-y-6">
      <ConfirmClearModal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onCleared={loadUsers}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Users</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">Details of Users</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Search customers and open full account details.
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

      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-sm)]">
        <label className="label">Search users</label>
        <input
          className="field"
          placeholder="Search by name, email, or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]">
        {loading ? (
          <p className="p-6 text-sm text-[var(--muted)]">Loading...</p>
        ) : error ? (
          <p className="p-6 text-sm text-[var(--danger)]">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full name</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Wishlist items</th>
                  <th>Registered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td className="font-mono text-xs">{user.id}</td>
                    <td className="font-medium text-[var(--navy)]">
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>{user._count.orders}</td>
                    <td>{user._count.wishlist}</td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                    <td>
                      <Link
                        href={`/dashboard/users/${user.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        Full details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
