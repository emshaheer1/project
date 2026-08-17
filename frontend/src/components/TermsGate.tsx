"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const KEY = "apollo_terms_accepted";

export function TermsGate() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    if (isDashboard) {
      setOpen(false);
      return;
    }
    const accepted = localStorage.getItem(KEY);
    if (!accepted) setOpen(true);
  }, [isDashboard]);

  if (!open || isDashboard) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(6,16,28,0.45)] p-4 backdrop-blur-xl animate-fade-in"
      data-terms-gate
      data-age-gate
    >
      <div className="pointer-events-none absolute inset-0 bg-[rgba(11,31,54,0.25)]" />
      <div className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-white shadow-[var(--shadow-lg)] animate-scale-in">
        <div className="shrink-0 border-b border-[var(--line)] bg-[linear-gradient(135deg,var(--navy-deep),var(--navy-mid))] px-6 py-5 text-white sm:px-8">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--gold-soft)] uppercase">
            Required Agreement
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Terms & Conditions
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Please read and accept these terms before entering the website.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 text-sm leading-7 text-[var(--muted)] sm:px-8">
          <p>
            By using this website and purchasing products, you confirm you are at
            least 21 years of age and a qualified researcher purchasing materials
            for laboratory research only.
          </p>
          <p className="mt-4">
            Products are not intended for human dosing, injection, or ingestion.
            Statements on this site have not been evaluated by the FDA and are not
            medical advice. Products are not intended to diagnose, treat, cure, or
            prevent any disease.
          </p>
          <p className="mt-4">
            We collect account, order, and contact information to fulfill purchases
            and respond to inquiries. We do not sell personal data. Payment data is
            processed by Stripe when enabled.
          </p>
          <p className="mt-4">
            You are responsible for complying with all applicable laws regarding
            purchase, possession, and use of research materials in your jurisdiction.
            The purchaser assumes full responsibility for proper handling and legal use.
          </p>
          <p className="mt-4">
            By clicking Accept, you agree to these Terms & Conditions and our
            research-use-only policy, and confirm you are a qualified independent
            researcher or institution.
          </p>
          <p className="mt-4">
            You can review the full policy anytime on our{" "}
            <Link
              href="/terms"
              className="font-semibold text-[var(--accent)] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Terms page
            </Link>
            .
          </p>
        </div>

        <div className="shrink-0 border-t border-[var(--line)] bg-[var(--surface)] px-6 py-4 sm:px-8">
          <button
            type="button"
            className="btn btn-dark btn-lg w-full"
            onClick={() => {
              localStorage.setItem(KEY, "1");
              setOpen(false);
            }}
          >
            Accept Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  );
}
