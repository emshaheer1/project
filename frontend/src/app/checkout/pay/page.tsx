"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function PayContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const orderNumber = params.get("orderNumber");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Opening Stripe secure payment…");

  useEffect(() => {
    let redirectTimer: number | undefined;

    try {
      const raw = sessionStorage.getItem("apollo_pending_payment");
      if (!raw) {
        setError("Payment session not found. Please return to checkout and try again.");
        return;
      }
      const pending = JSON.parse(raw) as {
        orderId?: string;
        orderNumber?: string;
        checkoutUrl?: string;
      };
      if (!pending.checkoutUrl) {
        setError("Stripe checkout URL is missing. Add STRIPE_SECRET_KEY on the API server.");
        return;
      }
      if (orderId && pending.orderId && pending.orderId !== orderId) {
        setError("This payment session does not match your order. Start checkout again.");
        return;
      }

      setStatus("Redirecting to Stripe — enter your card details on the next screen…");
      redirectTimer = window.setTimeout(() => {
        window.location.href = pending.checkoutUrl!;
      }, 700);
    } catch {
      setError("Could not start payment. Please try checkout again.");
    }

    return () => {
      if (redirectTimer) window.clearTimeout(redirectTimer);
    };
  }, [orderId]);

  if (error) {
    return (
      <div className="container-site py-20 text-center">
        <p className="eyebrow mx-auto">Payment</p>
        <h1 className="section-title mt-3">Could not open Stripe</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--danger)]">{error}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/checkout" className="btn btn-dark">
            Back to checkout
          </Link>
          <Link href="/cart" className="btn btn-outline">
            View cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-site py-20">
      <div className="mx-auto max-w-lg rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-8 text-center shadow-[var(--shadow-md)]">
        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--accent)]" />
        <p className="eyebrow mx-auto">Secure payment</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--navy)]">
          Proceeding to Stripe
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{status}</p>
        {orderNumber || orderId ? (
          <p className="mt-4 text-sm font-semibold text-[var(--navy)]">
            Order {orderNumber || orderId}
          </p>
        ) : null}
        <p className="mt-6 text-xs leading-5 text-[var(--muted)]">
          You will enter card details on Stripe’s hosted payment page. If nothing happens,{" "}
          <button
            type="button"
            className="font-semibold text-[var(--accent)] hover:underline"
            onClick={() => {
              const raw = sessionStorage.getItem("apollo_pending_payment");
              if (!raw) return;
              const pending = JSON.parse(raw) as { checkoutUrl?: string };
              if (pending.checkoutUrl) window.location.href = pending.checkoutUrl;
            }}
          >
            click here to continue
          </button>
          .
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPayPage() {
  return (
    <Suspense fallback={<div className="container-site py-20 text-center">Preparing payment…</div>}>
      <PayContent />
    </Suspense>
  );
}
