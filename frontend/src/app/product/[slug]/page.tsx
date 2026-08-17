"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BackLink } from "@/components/BackButton";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";
import { useWishlist } from "@/context/WishlistContext";
import { api, formatPrice, type Product } from "@/lib/api";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill={filled ? "currentColor" : "none"}>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h7M13 18h7M8 6v12M16 6v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Split dosage / pack info from the main product title for cleaner display. */
function splitProductName(name: string) {
  const packMatch = name.match(/^(.*?)\s+(\([^)]+\))$/);
  if (packMatch) {
    return { title: packMatch[1].trim(), detail: packMatch[2] };
  }

  const doseMatch = name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s?(?:mg|ml|g|mcg))$/i);
  if (doseMatch) {
    return { title: doseMatch[1].trim(), detail: doseMatch[2] };
  }

  return { title: name, detail: null };
}

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { toggle: toggleCompare, has: hasCompare } = useCompare();
  const { toggle: toggleWishlist, has: hasWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    api<{ product: Product; related: Product[] }>(`/api/products/${params.slug}`)
      .then((data) => {
        setProduct(data.product);
        setRelated(data.related);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Not found"));
  }, [params.slug]);

  if (error) {
    return (
      <div className="container-site py-20 text-center">
        <p className="eyebrow mx-auto">Unavailable</p>
        <h1 className="section-title mt-3">Product not found</h1>
        <p className="mx-auto mt-2 max-w-md text-[var(--muted)]">{error}</p>
        <Link href="/shop" className="btn btn-dark mt-8 inline-flex">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-site py-12 md:py-16">
        <div className="mb-8 h-4 w-48 animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="aspect-square animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-2)]" />
          <div className="space-y-4 pt-2">
            <div className="h-3 w-20 animate-pulse rounded bg-[var(--surface-2)]" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-[var(--surface-2)]" />
            <div className="h-8 w-28 animate-pulse rounded bg-[var(--surface-2)]" />
            <div className="h-28 w-full animate-pulse rounded bg-[var(--surface-2)]" />
            <div className="h-14 w-full animate-pulse rounded bg-[var(--surface-2)]" />
          </div>
        </div>
      </div>
    );
  }

  const wishlisted = hasWishlist(product.id);
  const compared = hasCompare(product.id);
  const onSale = Boolean(product.compareAt && product.compareAt > product.price);
  const { title: productTitle, detail: productDetail } = splitProductName(product.name);

  return (
    <div className="pb-20">
      <div className="container-site pt-6 md:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackLink href="/shop" label="Back to shop" />
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-[var(--navy)]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/shop" className="transition hover:text-[var(--navy)]">
              Shop
            </Link>
            <span aria-hidden="true">/</span>
            <span className="max-w-[12rem] truncate text-[var(--navy)] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-site py-8 md:py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[#070d14] shadow-[var(--shadow-md)] animate-fade-in">
            <div className="relative aspect-square">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain p-6 md:p-10"
                unoptimized
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
            </div>
            {onSale ? (
              <span className="absolute top-4 left-4 rounded-md bg-[var(--gold)] px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[var(--navy-deep)] uppercase">
                Sale
              </span>
            ) : null}
          </div>

          <div className="animate-fade-up lg:sticky lg:top-28">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[var(--surface-2)] px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
                {product.category}
              </span>
              <span
                className={`rounded-md px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase ${
                  product.inStock
                    ? "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-[var(--success)]"
                    : "bg-[color-mix(in_srgb,var(--danger)_12%,white)] text-[var(--danger)]"
                }`}
              >
                {product.inStock ? "In stock" : "Out of stock"}
              </span>
            </div>

            <h1 className="mt-5 max-w-xl">
              <span className="block font-[family-name:var(--font-display)] text-[clamp(1.85rem,4vw,2.85rem)] font-semibold leading-[1.12] tracking-[-0.035em] text-[var(--navy)]">
                {productTitle}
              </span>
              {productDetail ? (
                <span className="mt-2.5 block text-[0.95rem] font-medium tracking-[0.04em] text-[var(--accent)] md:text-base">
                  {productDetail}
                </span>
              ) : null}
            </h1>
            <div
              className="mt-5 h-px w-14 bg-[linear-gradient(90deg,var(--accent),var(--gold-soft),transparent)]"
              aria-hidden="true"
            />

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-[1.85rem] font-bold tracking-tight text-[var(--navy)] md:text-[2rem]">
                {formatPrice(product.price)}
              </span>
              {onSale ? (
                <span className="text-lg text-[var(--muted)] line-through">
                  {formatPrice(product.compareAt!)}
                </span>
              ) : null}
            </div>

            <p className="mt-6 max-w-xl text-[0.98rem] leading-8 text-[var(--muted)]">
              {product.description}
            </p>

            <div className="mt-7 grid grid-cols-3 gap-3 border-y border-[var(--line)] py-5">
              {[
                { label: "Purity", value: ">99%" },
                { label: "Form", value: "Lyophilized" },
                { label: "Use", value: "Research only" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--navy)]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex h-12 items-center overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="flex h-full w-11 items-center justify-center text-[var(--navy)] transition hover:bg-[var(--surface)]"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="min-w-10 text-center text-sm font-semibold text-[var(--navy)]">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="flex h-full w-11 items-center justify-center text-[var(--navy)] transition hover:bg-[var(--surface)]"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-dark btn-lg flex-1"
                disabled={!product.inStock}
                onClick={() => {
                  addItem(product, qty);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1400);
                }}
              >
                {added ? "Added to cart" : "Add to cart"}
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`btn btn-outline flex-1 !normal-case !tracking-normal ${
                  wishlisted ? "!border-[var(--accent)] !text-[var(--accent)]" : ""
                }`}
              >
                <HeartIcon filled={wishlisted} />
                {wishlisted ? "Saved" : "Wishlist"}
              </button>
              <button
                type="button"
                onClick={() => toggleCompare(product)}
                className={`btn btn-outline flex-1 !normal-case !tracking-normal ${
                  compared ? "!border-[var(--accent)] !text-[var(--accent)]" : ""
                }`}
              >
                <CompareIcon />
                {compared ? "Compared" : "Compare"}
              </button>
            </div>

            <p className="mt-6 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 text-sm leading-6 text-[var(--muted)]">
              <span className="font-semibold text-[var(--navy)]">For research use only.</span>{" "}
              Not for human consumption. Free shipping on orders over $200.
            </p>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20 md:mt-24">
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Continue browsing</p>
                  <h2 className="section-title mt-2 !mb-0">Related products</h2>
                </div>
                <Link
                  href="/shop"
                  className="hidden text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--navy)] sm:inline"
                >
                  View all →
                </Link>
              </div>
            </Reveal>
            <div className="stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Reveal key={item.id} className="h-full">
                  <ProductCard product={item} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
