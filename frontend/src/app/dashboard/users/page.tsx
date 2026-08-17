"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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

export default function RegisteredUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
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
          <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">Registered Users</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            All customer accounts created through the storefront.
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
          <p className="p-6 text-sm text-[var(--muted)]">Loading users...</p>
        ) : error ? (
          <p className="p-6 text-sm text-[var(--danger)]">{error}</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">No registered users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Wishlist</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium text-[var(--navy)]">
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>{user._count.orders}</td>
                    <td>{user._count.wishlist}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link
                        href={`/dashboard/users/${user.id}`}
                        className="text-sm font-semibold text-[var(--accent)] hover:underline"
                      >
                        View
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
