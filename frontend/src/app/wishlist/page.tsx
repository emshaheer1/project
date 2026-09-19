"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { api, type Product } from "@/lib/api";
import { listProducts } from "@/lib/catalog";

export default function WishlistPage() {
  const { user } = useAuth();
  const { ids } = useWishlist();
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    async function load() {
      try {
        if (user) {
          const data = await api<{ items: Array<{ product: Product }> }>("/api/wishlist");
          if (!cancelled) setCatalog(data.items.map((i) => i.product));
          return;
        }
        const all = await listProducts();
        if (!cancelled) setCatalog(all);
      } catch {
        if (!cancelled) setCatalog([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const products = catalog.filter((p) => ids.has(p.id));

  return (
    <div className="container-site py-12">
      <h1 className="section-title">Wishlist</h1>
      {loading ? (
        <p className="mt-8 text-[var(--muted)]">Loading wishlist...</p>
      ) : !products.length ? (
        <div className="mt-8">
          <p className="text-[var(--muted)]">Your wishlist is empty.</p>
          <Link href="/shop" className="btn btn-dark mt-6 inline-flex">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
