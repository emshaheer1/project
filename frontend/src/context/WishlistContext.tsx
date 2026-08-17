"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type Product } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type WishlistContextValue = {
  ids: Set<string>;
  toggle: (product: Product) => Promise<void>;
  has: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "apollo_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setIds(new Set(raw ? (JSON.parse(raw) as string[]) : []));
      } catch {
        setIds(new Set());
      }
      return;
    }

    api<{ items: Array<{ productId: string }> }>("/api/wishlist")
      .then((data) => setIds(new Set(data.items.map((i) => i.productId))))
      .catch(() => setIds(new Set()));
  }, [user]);

  useEffect(() => {
    if (user) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  }, [ids, user]);

  const toggle = useCallback(
    async (product: Product) => {
      const exists = ids.has(product.id);
      if (user) {
        if (exists) {
          await api(`/api/wishlist/${product.id}`, { method: "DELETE" });
          setIds((prev) => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
        } else {
          await api("/api/wishlist", {
            method: "POST",
            body: JSON.stringify({ productId: product.id }),
          });
          setIds((prev) => new Set(prev).add(product.id));
        }
        return;
      }

      setIds((prev) => {
        const next = new Set(prev);
        if (exists) next.delete(product.id);
        else next.add(product.id);
        return next;
      });
    },
    [ids, user]
  );

  const has = useCallback((productId: string) => ids.has(productId), [ids]);

  const value = useMemo(() => ({ ids, toggle, has }), [ids, toggle, has]);

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
