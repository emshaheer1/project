"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi, formatPrice } from "@/lib/api";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  updatedAt: string;
};

function normalizePriceInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const loadProducts = useCallback(() => {
    setLoading(true);
    adminApi<{ products: ProductRow[] }>("/api/admin/products")
      .then((data) => {
        setProducts(data.products);
        setDrafts(
          Object.fromEntries(data.products.map((p) => [p.id, String(p.price)]))
        );
        setError("");
        setRowError({});
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load products")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [products, filter]);

  async function savePrice(product: ProductRow) {
    const next = normalizePriceInput(drafts[product.id] ?? "");
    if (next === null) {
      setRowError((prev) => ({
        ...prev,
        [product.id]: "Enter a valid price",
      }));
      return;
    }

    if (next === product.price) {
      setDrafts((prev) => ({ ...prev, [product.id]: String(product.price) }));
      setRowError((prev) => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
      return;
    }

    await patchProduct(product, { price: next }, "Could not save price");
  }

  async function patchProduct(
    product: ProductRow,
    body: { price?: number; inStock?: boolean },
    failMessage: string
  ) {
    setSavingId(product.id);
    setRowError((prev) => {
      const copy = { ...prev };
      delete copy[product.id];
      return copy;
    });

    try {
      const data = await adminApi<{ product: ProductRow }>(
        `/api/admin/products/${product.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(body),
        }
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, ...data.product } : p))
      );
      setDrafts((prev) => ({
        ...prev,
        [product.id]: String(data.product.price),
      }));
      setSavedId(product.id);
      window.setTimeout(() => {
        setSavedId((id) => (id === product.id ? null : id));
      }, 1600);
    } catch (err) {
      setRowError((prev) => ({
        ...prev,
        [product.id]: err instanceof Error ? err.message : failMessage,
      }));
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--navy)]">
            Products
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Edit prices and mark items sold out. Changes save to the database and
            stay after server restart.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search products…"
            className="min-w-[220px] rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--navy)] outline-none focus:border-[var(--accent)]"
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={loadProducts}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]">
        {loading ? (
          <p className="p-6 text-sm text-[var(--muted)]">Loading products…</p>
        ) : error ? (
          <p className="p-6 text-sm text-[var(--danger)]">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current</th>
                  <th>New price (USD)</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const dirty =
                    normalizePriceInput(drafts[product.id] ?? "") !==
                    product.price;
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="h-10 w-10 rounded-md object-contain bg-[var(--surface)]"
                          />
                          <div>
                            <p className="font-medium text-[var(--navy)]">
                              {product.name}
                            </p>
                            {!product.inStock ? (
                              <p className="text-[11px] font-semibold tracking-wide text-[var(--danger)] uppercase">
                                Sold out on storefront
                              </p>
                            ) : null}
                            <p className="font-mono text-xs text-[var(--muted)]">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="rounded-md bg-[var(--surface)] px-2 py-1 text-xs font-semibold text-[var(--navy)]">
                          {product.category}
                        </span>
                      </td>
                      <td className="font-semibold text-[var(--accent)]">
                        {formatPrice(product.price)}
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[var(--muted)]">$</span>
                            <input
                              type="number"
                              min={0}
                              step={1}
                              inputMode="decimal"
                              value={drafts[product.id] ?? ""}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [product.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  void savePrice(product);
                                }
                              }}
                              className="w-28 rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm font-medium text-[var(--navy)] outline-none focus:border-[var(--accent)]"
                            />
                          </div>
                          {rowError[product.id] ? (
                            <p className="text-xs text-[var(--danger)]">
                              {rowError[product.id]}
                            </p>
                          ) : savedId === product.id ? (
                            <p className="text-xs font-medium text-emerald-600">
                              Saved — live on storefront
                            </p>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          aria-pressed={!product.inStock}
                          className={`btn btn-sm disabled:opacity-50 ${
                            product.inStock
                              ? "btn-outline"
                              : "!border-[var(--danger)] !bg-[var(--danger)] !text-white hover:!opacity-90"
                          }`}
                          disabled={savingId === product.id}
                          onClick={() =>
                            void patchProduct(
                              product,
                              { inStock: !product.inStock },
                              "Could not update stock"
                            )
                          }
                        >
                          Sold out
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm disabled:opacity-50"
                          disabled={savingId === product.id || !dirty}
                          onClick={() => void savePrice(product)}
                        >
                          {savingId === product.id && dirty ? "Saving…" : "Save"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && !error && products.length > 0 ? (
        <p className="text-sm text-[var(--muted)]">
          Showing {filtered.length} of {products.length} products
          {categories.length ? ` · ${categories.length} categories` : ""}.
        </p>
      ) : null}
    </div>
  );
}
