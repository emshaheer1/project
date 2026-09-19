"use client";

import { useEffect, useState } from "react";
import { HomeClient } from "@/components/HomeClient";
import { ProductMarquee } from "@/components/ProductMarquee";
import { listProducts } from "@/lib/catalog";
import type { Product } from "@/lib/api";

export function HomeCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listProducts()
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch(() => {
        // Leave empty — hero already visible; catalog sections hide when empty.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <section className="border-b border-[var(--line)] bg-white py-16" aria-busy="true">
        <div className="container-site">
          <div className="mx-auto h-3 w-40 animate-pulse rounded bg-[var(--line)]" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-[var(--radius-lg)] bg-[rgba(11,31,54,0.06)]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <ProductMarquee products={products} />
      <HomeClient products={products} />
    </>
  );
}
