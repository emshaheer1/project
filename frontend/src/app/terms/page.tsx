import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service & Privacy Policy" };

export default function TermsPage() {
  return (
    <div className="container-site py-12">
      <h1 className="section-title">Terms of Service & Privacy Policy</h1>
      <div className="mt-8 max-w-3xl space-y-4 text-sm leading-7 text-[var(--muted)]">
        <p>
          By using this website and purchasing products, you confirm you are at
          least 21 years of age and a qualified researcher purchasing materials
          for laboratory research only.
        </p>
        <p>
          Products are not intended for human dosing, injection, or ingestion.
          Statements on this site have not been evaluated by the FDA and are not
          medical advice.
        </p>
        <p>
          We collect account, order, and contact information to fulfill purchases
          and respond to inquiries. We do not sell personal data. Payment data is
          processed by Stripe when enabled.
        </p>
        <p>
          You are responsible for complying with all applicable laws regarding
          purchase, possession, and use of research materials in your jurisdiction.
        </p>
      </div>
    </div>
  );
}
