"use client";

import Link from "next/link";
import { formatPrice, type Product } from "@/lib/api";

export function ProductMarquee({ products }: { products: Product[] }) {
  if (!products.length) return null;

  const loop = [...products, ...products, ...products];

  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(90deg,#e8f4f6_0%,#f0f7f8_50%,#e8f4f6_100%)]"
      aria-label="Featured research catalog"
    >
      <div className="border-b border-[rgba(26,155,176,0.18)] px-4 py-2 text-center">
        <p className="text-[9px] font-semibold tracking-[0.28em] text-[var(--accent)] uppercase">
          Research Catalog · Continuous Supply
        </p>
      </div>

      <div className="relative py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#e8f4f6] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#e8f4f6] to-transparent sm:w-32" />

        <div className="marquee-track flex w-max items-center">
          {loop.map((product, index) => (
            <div key={`${product.id}-${index}`} className="flex shrink-0 items-center">
              <Link
                href={`/product/${product.slug}`}
                className="group flex items-baseline gap-2 px-5 transition"
              >
                <span className="whitespace-nowrap text-[11px] font-medium tracking-[0.12em] text-[var(--navy)] uppercase transition group-hover:text-[var(--accent)] sm:text-xs">
                  {product.name}
                </span>
                <span className="whitespace-nowrap text-[10px] font-medium tracking-[0.06em] text-[var(--gold)] transition group-hover:text-[var(--navy)]">
                  {formatPrice(product.price)}
                </span>
              </Link>
              <span
                className="h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
