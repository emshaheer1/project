"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-[18px] w-[18px]"
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

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle: toggleWishlist, has: hasWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const wishlisted = hasWishlist(product.id);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)] transition duration-300 hover:shadow-[var(--shadow-md)]">
      <div className="relative shrink-0 bg-[var(--surface)]">
        <Link
          href={`/product/${product.slug}`}
          className="relative block aspect-square overflow-hidden"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 hover:scale-[1.03]"
            sizes="(max-width:768px) 50vw, 25vw"
            unoptimized
          />
        </Link>

        {product.compareAt ? (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-[var(--gold)] px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-[var(--navy-deep)] uppercase">
            Sale
          </span>
        ) : null}

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={wishlisted ? "Saved" : "Wishlist"}
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_2px_10px_rgba(11,31,54,0.12)] transition ${
            wishlisted
              ? "border-[var(--accent)] bg-[var(--accent)] text-white"
              : "border-[var(--line)] bg-white text-[var(--navy)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          }`}
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--muted)] uppercase">
          {product.category}
        </p>

        <Link href={`/product/${product.slug}`} className="mt-2 block">
          <h3 className="line-clamp-2 min-h-[2.625rem] text-[1.05rem] font-semibold leading-snug text-[var(--navy)] transition hover:text-[var(--navy-mid)]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex min-h-[1.75rem] items-baseline gap-2">
          <span className="text-xl font-bold text-[var(--accent)]">
            {formatPrice(product.price)}
          </span>
          {product.compareAt ? (
            <span className="text-sm font-medium text-[var(--muted)] line-through">
              {formatPrice(product.compareAt)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-5">
          <button
            type="button"
            className="btn btn-dark w-full"
            onClick={() => {
              addItem(product);
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
            }}
          >
            {added ? "Added to cart" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
