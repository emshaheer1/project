"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, type Product } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
    >
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

function shortDescription(text: string) {
  const cleaned = text
    .replace(/\s+/g, " ")
    .replace(/For research use only\.?/gi, "")
    .replace(/Currently sold out\.?/gi, "")
    .trim();
  if (cleaned.length <= 110) return cleaned;
  const clipped = cleaned.slice(0, 110);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 70 ? lastSpace : 110).trim()}…`;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle: toggleWishlist, has: hasWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const wishlisted = hasWishlist(product.id);
  const onSale = Boolean(product.compareAt && product.compareAt > product.price);
  const soldOut = product.inStock === false;
  const blurb = shortDescription(product.description || "");

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--line))] hover:shadow-[var(--shadow-md)]">
      <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(180deg,#f4f7fa_0%,#eef3f7_100%)]">
        <Link
          href={`/product/${product.slug}`}
          className={`relative block aspect-[4/5] p-5 sm:p-6 ${
            soldOut ? "opacity-60" : ""
          }`}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-3 transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width:768px) 50vw, 25vw"
            unoptimized
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,rgba(255,255,255,0.9),transparent)]" />

        {soldOut ? (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-[var(--navy)] px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] text-white uppercase">
            Sold out
          </span>
        ) : onSale ? (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-[var(--gold)] px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] text-[var(--navy-deep)] uppercase">
            Sale
          </span>
        ) : (
          <span className="absolute top-3 left-3 z-10 rounded-md border border-[var(--line)] bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-[var(--navy)] uppercase backdrop-blur-sm">
            {product.category}
          </span>
        )}

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={wishlisted ? "Saved" : "Wishlist"}
          onClick={() => void toggleWishlist(product)}
          className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition ${
            wishlisted
              ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_6px_16px_rgba(26,155,176,0.35)]"
              : "border-[var(--line)] bg-white/95 text-[var(--navy)] shadow-[0_2px_10px_rgba(11,31,54,0.1)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          }`}
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-5 pt-4 pb-5">
        {soldOut || onSale ? (
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            {product.category}
          </p>
        ) : null}

        <Link href={`/product/${product.slug}`} className="mt-1 block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--navy)] transition group-hover:text-[var(--navy-mid)]">
            {product.name}
          </h3>
        </Link>

        {blurb ? (
          <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-[var(--muted)]">
            {blurb}
          </p>
        ) : null}

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-[var(--line)] pt-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
              Research use
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-[var(--accent)]">
                {formatPrice(product.price)}
              </span>
              {onSale ? (
                <span className="text-sm font-medium text-[var(--muted)] line-through">
                  {formatPrice(product.compareAt!)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-stretch gap-2">
          <button
            type="button"
            className="btn btn-dark min-w-0 flex-1 !px-3 !text-[0.72rem] !tracking-[0.06em] sm:!px-4 sm:!text-[0.8rem]"
            disabled={soldOut}
            onClick={() => {
              if (soldOut) return;
              addItem(product);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1200);
            }}
          >
            {soldOut ? "Sold out" : added ? "Added" : "Add to cart"}
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="btn btn-outline inline-flex h-auto w-11 shrink-0 items-center justify-center !px-0"
            aria-label={`View ${product.name}`}
            title="View details"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
