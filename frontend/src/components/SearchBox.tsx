"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { api, formatPrice, type Product } from "@/lib/api";

const PAGE_SUGGESTIONS = [
  { href: "/", label: "Home", keywords: ["home", "main"] },
  { href: "/shop", label: "Products", keywords: ["shop", "products", "catalog", "peptides"] },
  { href: "/bulk-offers", label: "Bulk Offers", keywords: ["bulk", "offers", "wholesale", "lab"] },
  { href: "/about", label: "About", keywords: ["about", "company", "mission"] },
  { href: "/faqs", label: "FAQs", keywords: ["faq", "faqs", "questions", "help"] },
  { href: "/contact", label: "Contact", keywords: ["contact", "support", "email", "message"] },
  { href: "/cart", label: "Cart", keywords: ["cart", "bag", "checkout"] },
  { href: "/wishlist", label: "Wishlist", keywords: ["wishlist", "saved", "favorites"] },
  { href: "/login", label: "Login / Register", keywords: ["login", "register", "account", "sign"] },
];

function IconSearch({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M20 20l-3.8-3.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function matchPages(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PAGE_SUGGESTIONS.filter(
    (page) =>
      page.label.toLowerCase().includes(q) ||
      page.keywords.some((k) => k.includes(q) || q.includes(k))
  ).slice(0, 4);
}

type SearchBoxProps = {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
  initialQuery?: string;
  onNavigate?: () => void;
};

export function SearchBox({
  className = "",
  inputClassName = "field min-w-0 flex-1",
  placeholder = "Search products, pages...",
  autoFocus = false,
  initialQuery = "",
  onNavigate,
}: SearchBoxProps) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const pages = matchPages(query);
  const hasSuggestions = pages.length > 0 || products.length > 0 || loading;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(() => {
      api<{ products: Product[] }>(`/api/products?search=${encodeURIComponent(q)}`)
        .then((data) => {
          if (!cancelled) setProducts(data.products.slice(0, 6));
        })
        .catch(() => {
          if (!cancelled) setProducts([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  const flatItems = [
    ...pages.map((p) => ({ type: "page" as const, href: p.href, label: p.label })),
    ...products.map((p) => ({
      type: "product" as const,
      href: `/product/${p.slug}`,
      label: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
    })),
  ];

  function go(href: string) {
    setOpen(false);
    setActiveIndex(-1);
    onNavigate?.();
    router.push(href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (activeIndex >= 0 && flatItems[activeIndex]) {
      go(flatItems[activeIndex].href);
      return;
    }
    go(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !flatItems.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? flatItems.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <form onSubmit={onSubmit} className="flex gap-2 sm:gap-3">
        <input
          className={inputClassName}
          placeholder={placeholder}
          value={query}
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={open && hasSuggestions}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={onKeyDown}
        />
        <button className="btn btn-dark shrink-0" type="submit" aria-label="Submit search">
          <IconSearch className="h-4 w-4 text-white" />
        </button>
      </form>

      {open && query.trim() ? (
        <div
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+0.5rem)] right-0 left-0 z-50 overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-white shadow-[var(--shadow-lg)] animate-fade-in"
        >
          {loading && !flatItems.length ? (
            <p className="px-4 py-3 text-sm text-[var(--muted)]">Searching...</p>
          ) : null}

          {!loading && !flatItems.length ? (
            <p className="px-4 py-3 text-sm text-[var(--muted)]">
              No matches. Press Enter to search the catalog.
            </p>
          ) : null}

          {pages.length > 0 ? (
            <div className="border-b border-[var(--line)]">
              <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-[0.16em] text-[var(--muted)] uppercase">
                Pages
              </p>
              {pages.map((page) => {
                const index = flatItems.findIndex(
                  (item) => item.type === "page" && item.href === page.href
                );
                return (
                  <button
                    key={page.href}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition ${
                      activeIndex === index
                        ? "bg-[var(--surface-2)] text-[var(--navy)]"
                        : "text-[var(--navy)] hover:bg-[var(--surface-2)]"
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => go(page.href)}
                  >
                    <span className="font-medium">{page.label}</span>
                    <span className="text-xs text-[var(--muted)]">Page</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {products.length > 0 ? (
            <div>
              <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-[0.16em] text-[var(--muted)] uppercase">
                Products
              </p>
              {products.map((product) => {
                const index = flatItems.findIndex(
                  (item) => item.type === "product" && item.href === `/product/${product.slug}`
                );
                return (
                  <button
                    key={product.id}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                      activeIndex === index ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface-2)]"
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => go(`/product/${product.slug}`)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover bg-[var(--surface-2)]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[var(--navy)]">
                        {product.name}
                      </span>
                      <span className="block text-xs text-[var(--accent)]">
                        {formatPrice(product.price)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <Link
            href={
              query.trim()
                ? `/shop?search=${encodeURIComponent(query.trim())}`
                : "/shop"
            }
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="block border-t border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--accent)] hover:bg-[var(--surface-2)]"
          >
            View all results for “{query.trim()}”
          </Link>
        </div>
      ) : null}
    </div>
  );
}
