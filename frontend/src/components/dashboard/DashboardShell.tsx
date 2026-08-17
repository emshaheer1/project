"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { adminApi, clearAdminSession, getAdminToken } from "@/lib/api";

type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

function Icon({
  path,
  className = "h-5 w-5",
}: {
  path: string;
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const nav = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: "M4 6h16M4 12h16M4 18h10",
  },
  {
    label: "Users",
    icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    children: [
      { href: "/dashboard/users", label: "Registered Users" },
      { href: "/dashboard/users/details", label: "Details of Users" },
    ],
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: "M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  },
  {
    href: "/dashboard/contacts",
    label: "Contact Requests",
    icon: "M4 6h16v12H4zM4 8l8 5 8-5",
  },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/dashboard/login";
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(!isLogin);
  const [usersOpen, setUsersOpen] = useState(
    pathname.startsWith("/dashboard/users")
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isLogin) {
      setLoading(false);
      return;
    }
    const token = getAdminToken();
    if (!token) {
      router.replace("/dashboard/login");
      return;
    }
    adminApi<{ user: AdminUser }>("/api/admin/me")
      .then((data) => setAdmin(data.user))
      .catch(() => {
        clearAdminSession();
        router.replace("/dashboard/login");
      })
      .finally(() => setLoading(false));
  }, [isLogin, router, pathname]);

  useEffect(() => {
    if (pathname.startsWith("/dashboard/users")) setUsersOpen(true);
  }, [pathname]);

  function logout() {
    clearAdminSession();
    router.replace("/dashboard/login");
  }

  if (isLogin) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] text-[var(--muted)]">
        Loading dashboard...
      </div>
    );
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col bg-[var(--navy-deep)] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--gold-soft)] uppercase">
          Alpha Admin
        </p>
        <h1 className="mt-1 text-xl font-semibold">Dashboard</h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          if (item.children) {
            const childActive = item.children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setUsersOpen((v) => !v)}
                  className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-sm font-medium transition ${
                    childActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon path={item.icon} />
                    {item.label}
                  </span>
                  <svg
                    className={`h-4 w-4 transition ${usersOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                {usersOpen ? (
                  <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block rounded-[8px] px-3 py-2 text-sm transition ${
                          pathname === child.href || pathname.startsWith(child.href + "/")
                            ? "bg-[var(--accent)] text-white"
                            : "text-white/65 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          }

          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[var(--accent)] text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon path={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-medium">
          {admin?.firstName} {admin?.lastName}
        </p>
        <p className="truncate text-xs text-white/50">{admin?.email}</p>
        <button
          type="button"
          onClick={logout}
          className="btn btn-outline mt-3 w-full !border-white/20 !bg-transparent !text-white hover:!border-transparent hover:!bg-[var(--accent)]"
        >
          Logout
        </button>
        <Link href="/" className="mt-2 block text-center text-xs text-white/45 hover:text-white">
          Back to store
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <div className="hidden lg:block">{sidebar}</div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">{sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--line)] bg-white px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-outline btn-sm lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              Menu
            </button>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
                Admin Panel
              </p>
              <h2 className="text-sm font-semibold text-[var(--navy)] lg:text-base">
                Alpha Peptides
              </h2>
            </div>
          </div>
          <Link href="/" className="btn btn-outline btn-sm hidden sm:inline-flex">
            View store
          </Link>
        </header>
        <div className="flex-1 p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}
