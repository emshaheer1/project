"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { SearchBox } from "@/components/SearchBox";
import { UserMenu } from "@/components/UserMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/shop", label: "Products" },
  { href: "/bulk-offers", label: "Bulk Offers" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

function IconSearch({ className = "h-[22px] w-[22px]" }: { className?: string }) {
  return (
    <svg
      className={`${className} text-[var(--navy)] transition-colors duration-200 group-hover:text-white`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M20 20l-3.8-3.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCart({ className = "h-[22px] w-[22px]" }: { className?: string }) {
  return (
    <svg
      className={`${className} text-[var(--navy)] transition-colors duration-200 group-hover:text-white`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 5h1.8l1.5 10.4a1.6 1.6 0 0 0 1.6 1.4h8.8a1.6 1.6 0 0 0 1.6-1.3L21 8.2H7.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="10" cy="20" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="17.2" cy="20" r="1.35" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconMenu({ className = "h-[22px] w-[22px]" }: { className?: string }) {
  return (
    <svg
      className={`${className} text-[var(--navy)] transition-colors duration-200 group-hover:text-white`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function IconClose({ className = "h-[22px] w-[22px]" }: { className?: string }) {
  return (
    <svg
      className={`${className} text-[var(--navy)] transition-colors duration-200 group-hover:text-white`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

const iconControlClass =
  "header-icon-btn group relative inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[var(--line)] bg-white shadow-[0_1px_2px_rgba(11,31,54,0.06)] transition duration-200 hover:border-[var(--navy)] hover:bg-[var(--navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

function IconButton({
  children,
  className = "",
  count,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { count?: number }) {
  return (
    <button type="button" className={`${iconControlClass} ${className}`} {...props}>
      {children}
      {typeof count === "number" && count > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold leading-none text-white shadow-sm">
          {count}
        </span>
      ) : null}
    </button>
  );
}

function IconLink({
  href,
  children,
  count,
  label,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  count?: number;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`${iconControlClass} ${className}`}
    >
      {children}
      {typeof count === "number" && count > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold leading-none text-white shadow-sm">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 isolate bg-white shadow-[0_1px_0_rgba(11,31,54,0.08)]">
      <div className="bg-[linear-gradient(90deg,var(--navy-deep),var(--navy-mid))] py-2.5 text-center text-[11px] font-medium tracking-[0.18em] text-white/90 uppercase">
        Free Shipping on Orders Over $200
      </div>

      <div className="border-b border-[var(--line)] bg-white">
        <div className="container-site flex items-center justify-between gap-4 py-3.5 lg:py-4">
          <Link
            href="/"
            className="relative block h-[52px] w-[220px] shrink-0 md:h-[56px] md:w-[240px]"
            aria-label="Alpha Peptides home"
          >
            <Image
              src="/logo-alpha-peptides.png"
              alt="Alpha Peptides"
              fill
              className="object-contain object-left transition duration-300 group-hover:opacity-90"
              sizes="240px"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <IconButton
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              title="Search"
            >
              <IconSearch />
            </IconButton>

            <IconLink href="/cart" label="Cart" count={count}>
              <IconCart />
            </IconLink>

            {user ? (
              <UserMenu onNavigate={() => setOpen(false)} />
            ) : (
              <Link
                href="/login"
                className="btn btn-dark btn-sm ml-1 hidden md:inline-flex"
              >
                Login
              </Link>
            )}

            <IconButton
              className="lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <IconClose /> : <IconMenu />}
            </IconButton>
          </div>
        </div>

        {searchOpen ? (
          <div className="border-t border-[var(--line)] animate-fade-in">
            <div className="container-site py-3">
              <SearchBox
                className="w-full"
                inputClassName="field !w-full"
                placeholder="Search products, pages..."
                autoFocus
                onNavigate={() => {
                  setSearchOpen(false);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        ) : null}

        {open ? (
          <div className="border-t border-[var(--line)] px-4 pb-5 lg:hidden animate-fade-in">
            <div className="flex flex-col gap-1 pt-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium transition hover:bg-[var(--surface-2)] ${
                    pathname === link.href
                      ? "bg-[var(--surface-2)] text-[var(--navy)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <SearchBox
                className="mt-2 w-full"
                inputClassName="field !w-full"
                placeholder="Search products, pages..."
                onNavigate={() => setOpen(false)}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/cart" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
                  Cart ({count})
                </Link>
                {!user ? (
                  <Link href="/login" className="btn btn-dark btn-sm" onClick={() => setOpen(false)}>
                    Login / Register
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
