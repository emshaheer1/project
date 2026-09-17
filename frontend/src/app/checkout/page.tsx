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
  const { items, subtotal } = useCart();
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
        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
          Your cart is empty. Add products, then return here to pay securely with Stripe.
        </p>
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
        order: { id: string; orderNumber: string };
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

      // Keep cart until payment succeeds (success page clears it).
      // If Stripe is configured, open hosted Checkout (card details page).
      if (data.checkoutUrl) {
        sessionStorage.setItem(
          "apollo_pending_payment",
          JSON.stringify({
            orderId: data.order.id,
            orderNumber: data.order.orderNumber,
            checkoutUrl: data.checkoutUrl,
          })
        );
        router.push(
          `/checkout/pay?orderId=${encodeURIComponent(data.order.id)}&orderNumber=${encodeURIComponent(data.order.orderNumber)}`
        );
        return;
      }

      // Local/demo fallback when STRIPE_SECRET_KEY is not set yet
      router.push(
        `/checkout/success?orderId=${data.order.id}&orderNumber=${encodeURIComponent(data.order.orderNumber)}&demo=1`
      );
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
        <p className="mt-3 rounded-[var(--radius)] border border-[var(--danger)]/30 bg-[color-mix(in_srgb,var(--danger)_8%,white)] px-4 py-3 text-sm text-[var(--danger)]">
          Payment was canceled. Your cart is still here — you can try again below.
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
              <div
                key={key}
                className={
                  key === "address1" || key === "address2" || key === "email"
                    ? "md:col-span-2"
                    : ""
                }
              >
                <label className="label">{label}</label>
                <input
                  className="field"
                  type={type}
                  required={key !== "address2"}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>

          <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-sm text-[var(--muted)]">
            <p className="font-semibold text-[var(--navy)]">Next: secure Stripe payment</p>
            <p className="mt-1 leading-6">
              After you click <strong>Proceed to payment</strong>, you will be taken to
              Stripe’s secure page to enter card details and complete payment. We never
              store your full card number on our servers.
            </p>
          </div>

          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <button className="btn btn-dark btn-lg w-full sm:w-auto" disabled={loading}>
            {loading ? "Preparing payment..." : "Proceed to payment"}
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
          <p className="mt-5 text-xs leading-5 text-[var(--muted)]">
            Payments processed by Stripe. Research use only.
          </p>
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
