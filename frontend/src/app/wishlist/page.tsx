"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { api, type Product } from "@/lib/api";

export default function WishlistPage() {
  const { user } = useAuth();
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      if (user) {
        const data = await api<{ items: Array<{ product: Product }> }>("/api/wishlist");
        setProducts(data.items.map((i) => i.product));
        return;
      }
      const data = await api<{ products: Product[] }>("/api/products");
      setProducts(data.products.filter((p) => ids.has(p.id)));
    }
    load().catch(() => setProducts([]));
  }, [user, ids]);

  return (
    <div className="container-site py-12">
      <h1 className="section-title">Wishlist</h1>
      {!products.length ? (
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
