"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";
import { ThemeSelect } from "@/components/ThemeSelect";
import { api, type Product } from "@/lib/api";

const categories = ["All", "Peptides", "Bulk", "Accessories"] as const;

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
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (sort !== "default") params.set("sort", sort);
    if (search) params.set("search", search);
    api<{ products: Product[] }>(`/api/products?${params.toString()}`)
      .then((data) => {
        setProducts(data.products);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [sort, search]);

  const filtered = useMemo(() => {
    if (category === "All") return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Research Catalog"
        title="Our Products"
        description="Browse third-party tested research peptides and laboratory materials. All products are intended for research use only."
      />

      <div className="border-b border-[var(--line)] bg-white">
        <div className="container-site flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-[8px] border px-3.5 py-2 text-xs font-semibold tracking-wide transition ${
                  category === item
                    ? "border-transparent bg-[var(--accent)] text-white"
                    : "border-[var(--line)] bg-white text-[var(--navy)] hover:border-transparent hover:bg-[var(--accent)] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBox
              className="w-full sm:w-80"
              inputClassName="field min-w-0 flex-1"
              placeholder="Search products, pages..."
              initialQuery={search}
            />
            <ThemeSelect
              className="w-full sm:w-56"
              value={sort}
              onChange={setSort}
              options={sortOptions}
              ariaLabel="Sort products"
            />
          </div>
        </div>
      </div>

      <div className="container-site mt-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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
          <div className="flex gap-2">
            <Link href="/bulk-offers" className="btn btn-outline btn-sm">
              Bulk offers
            </Link>
            <Link href="/contact" className="btn btn-outline btn-sm">
              Request quote
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
            <p className="text-[var(--navy)] font-semibold">No products found</p>
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
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
