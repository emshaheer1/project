"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";
import { ThemeSelect } from "@/components/ThemeSelect";
import type { Product } from "@/lib/api";
import { listProducts } from "@/lib/catalog";
import { sortProductsByDose } from "@/lib/productSort";

const CATEGORY_ORDER = [
  "Retatrutide",
  "Tirzepatide",
  "Peptide Blends",
  "BB",
  "Tesamorelin",
  "MOTS-c",
  "NAD+",
  "BPC-157",
  "GHK-Cu",
  "BAC Water",
  "Bulk",
] as const;

const sortOptions = [
  { value: "default", label: "Default sorting" },
  { value: "latest", label: "Latest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    listProducts({
      sort: sort === "default" ? "default" : sort,
      search: search || undefined,
    })
      .then((list) => {
        setProducts(list);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [sort, search]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const categoryOptions = useMemo(() => {
    const known = CATEGORY_ORDER.filter((c) => categoryCounts[c]);
    const extras = Object.keys(categoryCounts)
      .filter((c) => !(CATEGORY_ORDER as readonly string[]).includes(c))
      .sort();
    return ["All", ...known, ...extras];
  }, [categoryCounts]);

  const categorySelectOptions = useMemo(
    () =>
      categoryOptions.map((item) => ({
        value: item,
        label:
          item === "All"
            ? `All products (${products.length})`
            : `${item} (${categoryCounts[item] || 0})`,
      })),
    [categoryOptions, categoryCounts, products.length]
  );

  const filtered = useMemo(() => {
    const list =
      category === "All" ? products : products.filter((p) => p.category === category);
    return sort === "default" ? sortProductsByDose(list) : list;
  }, [products, category, sort]);

  function selectCategory(next: string) {
    setCategory(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "All") params.delete("category");
    else params.set("category", next);
    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop");
  }

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Research Catalog"
        title="Our Products"
        description="Browse third-party tested research peptides and laboratory materials. All products are intended for research use only."
      />

      <div className="container-site mt-8 lg:mt-10">
        <div className="mb-6 flex flex-col gap-3 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">
              Showing{" "}
              <strong className="text-[var(--navy)]">{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "product" : "products"}
              {category !== "All" ? (
                <span>
                  {" "}
                  in <strong className="text-[var(--navy)]">{category}</strong>
                </span>
              ) : null}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBox
              className="w-full sm:w-72"
              inputClassName="field min-w-0 flex-1"
              placeholder="Search catalog..."
              initialQuery={search}
            />
            <ThemeSelect
              className="w-full sm:w-52"
              value={sort}
              onChange={setSort}
              options={sortOptions}
              ariaLabel="Sort products"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-3 lg:hidden">
              <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[var(--muted)] uppercase">
                Category
              </p>
              <ThemeSelect
                value={category}
                onChange={selectCategory}
                options={categorySelectOptions}
                ariaLabel="Filter by category"
              />
            </div>

            <div className="hidden lg:block">
              <p className="mb-4 text-[11px] font-semibold tracking-[0.16em] text-[var(--muted)] uppercase">
                Categories
              </p>
              <nav aria-label="Product categories" className="flex flex-col">
                {categoryOptions.map((item) => {
                  const count = item === "All" ? products.length : categoryCounts[item] || 0;
                  const active = category === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => selectCategory(item)}
                      className={`group flex items-center justify-between border-b border-[var(--line)] py-3 text-left text-sm transition ${
                        active
                          ? "border-[var(--accent)] text-[var(--navy)]"
                          : "text-[var(--muted)] hover:text-[var(--navy)]"
                      }`}
                    >
                      <span className={`font-medium ${active ? "text-[var(--navy)]" : ""}`}>
                        {item === "All" ? "All products" : item}
                      </span>
                      <span
                        className={`tabular-nums text-xs ${
                          active ? "text-[var(--accent)]" : "text-[var(--muted)]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 flex flex-col gap-2">
                <Link href="/bulk-offers" className="btn btn-outline btn-sm w-full justify-center">
                  Bulk offers
                </Link>
                <Link href="/contact" className="btn btn-outline btn-sm w-full justify-center">
                  Request quote
                </Link>
              </div>
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-2)]"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-10 text-center text-[var(--danger)] shadow-[var(--shadow-sm)]">
                {error}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-10 text-center shadow-[var(--shadow-sm)]">
                <p className="font-semibold text-[var(--navy)]">No products found</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Try another search term or category.
                </p>
                <button
                  type="button"
                  className="btn btn-dark mt-6"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                    setSort("default");
                    router.push("/shop");
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-16 text-[var(--muted)]">Loading shop...</div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
