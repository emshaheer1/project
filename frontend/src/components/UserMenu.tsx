"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/lib/api";

function IconUser({ className = "h-[22px] w-[22px]" }: { className?: string }) {
  return (
    <svg
      className={`${className} text-[var(--navy)] transition-colors duration-200 group-hover:text-white`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M5 19.2c1.8-3.2 4.2-4.7 7-4.7s5.2 1.5 7 4.7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHeart({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 7.4a3.8 3.8 0 0 1 7 3.4C19 15.6 12 20 12 20z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconOrders({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7h14l-1.4 8.2a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.7L5.5 3H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.2" fill="currentColor" />
      <circle cx="17" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function initials(user: User) {
  return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";
}

const iconControlClass =
  "header-icon-btn group relative inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[var(--line)] bg-white shadow-[0_1px_2px_rgba(11,31,54,0.06)] transition duration-200 hover:border-[var(--navy)] hover:bg-[var(--navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

type UserMenuProps = {
  onNavigate?: () => void;
};

export function UserMenu({ onNavigate }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!user) return null;

  function closeAnd(nav?: () => void) {
    setOpen(false);
    onNavigate?.();
    nav?.();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={iconControlClass}
        aria-label="Account menu"
        aria-expanded={open}
        title="Account"
        onClick={() => setOpen((v) => !v)}
      >
        <IconUser />
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+0.55rem)] right-0 z-50 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-lg)] animate-fade-in">
          <div className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--surface)] px-4 py-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--navy)] text-sm font-semibold tracking-wide text-white">
              {initials(user)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-[var(--navy)]">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
            </div>
          </div>

          <div className="p-2">
            <Link
              href="/account/orders"
              onClick={() => closeAnd()}
              className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-[var(--navy)] transition hover:bg-[var(--surface-2)]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent)]">
                <IconOrders />
              </span>
              Order History
            </Link>

            <Link
              href="/wishlist"
              onClick={() => closeAnd()}
              className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-[var(--navy)] transition hover:bg-[var(--surface-2)]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent)]">
                <IconHeart />
              </span>
              Wishlist
            </Link>

            <Link
              href="/account/address"
              onClick={() => closeAnd()}
              className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-[var(--navy)] transition hover:bg-[var(--surface-2)]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent)]">
                <IconPin />
              </span>
              Address
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                closeAnd();
              }}
              className="mt-1 flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-[var(--danger)] transition hover:bg-red-50"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-[var(--danger)]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-2M3 12h12M10 8l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
