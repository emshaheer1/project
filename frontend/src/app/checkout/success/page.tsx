"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const orderNumber = params.get("orderNumber");
  const demo = params.get("demo");
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    sessionStorage.removeItem("apollo_pending_payment");
  }, [clearCart]);

  return (
    <div className="container-site py-24 text-center animate-scale-in">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_15%,white)] text-2xl text-[var(--success)]">
        ✓
      </div>
      <p className="eyebrow mx-auto">Order confirmed</p>
      <h1 className="section-title mt-3">Thank you for your order</h1>
      <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
        {demo
          ? "Demo checkout completed (Stripe keys are not set yet). When you add STRIPE_SECRET_KEY, customers will pay on Stripe’s secure card page instead."
          : "Payment received via Stripe. We will prepare your research materials for shipment."}
      </p>
      {orderNumber || orderId ? (
        <p className="mt-4 inline-block rounded-[var(--radius)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold tracking-wide text-[var(--navy)]">
          Order ID: {orderNumber || orderId}
        </p>
      ) : null}
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/account" className="btn btn-dark">
          View account
        </Link>
        <Link href="/shop" className="btn btn-outline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container-site py-20">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
