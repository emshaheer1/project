"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BackLink } from "@/components/BackButton";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api, formatPrice } from "@/lib/api";

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const shipping = subtotal >= 200 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address1: user.address1 || prev.address1,
        address2: user.address2 || prev.address2,
        city: user.city || prev.city,
        state: user.state || prev.state,
        zip: user.zip || prev.zip,
        country: user.country || prev.country || "US",
      }));
    }
  }, [user]);

  if (!items.length) {
    return (
      <div className="container-site py-16 text-center">
        <h1 className="section-title">Nothing to checkout</h1>
        <Link href="/shop" className="btn btn-dark mt-6 inline-flex">
          Browse products
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api<{
        order: { id: string };
        checkoutUrl: string | null;
        demo: boolean;
      }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });

      clearCart();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      router.push(`/checkout/success?orderId=${data.order.id}&demo=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-site page-hero pb-16">
      <div className="mb-6">
        <BackLink href="/cart" label="Back to cart" />
      </div>
      <p className="eyebrow animate-fade-up">Secure checkout</p>
      <h1 className="section-title mt-2 animate-fade-up-delay">Checkout</h1>
      {canceled ? (
        <p className="mt-3 text-sm text-[var(--danger)]">
          Payment was canceled. You can try again below.
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-sm)] animate-fade-up md:p-8">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--navy)]">
            Shipping details
          </h2>
          <div className="divider-accent !mt-2" />
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ["email", "Email", "email"],
                ["firstName", "First name", "text"],
                ["lastName", "Last name", "text"],
                ["address1", "Address", "text"],
                ["address2", "Apartment, suite (optional)", "text"],
                ["city", "City", "text"],
                ["state", "State", "text"],
                ["zip", "ZIP", "text"],
              ] as const
            ).map(([key, label, type]) => (
              <div key={key} className={key === "address1" || key === "address2" || key === "email" ? "md:col-span-2" : ""}>
                <label className="label">{label}</label>
                <input
                  className="field"
                  type={type}
                  required={key !== "address2"}
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <button className="btn btn-dark btn-lg" disabled={loading}>
            {loading ? "Placing order..." : "Place order"}
          </button>
        </div>
        <aside className="h-fit rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-md)] animate-fade-up-delay">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--navy)]">
            Your order
          </h2>
          <div className="divider-accent" />
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.product.id} className="flex justify-between gap-3">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container-site py-12">Loading checkout...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
