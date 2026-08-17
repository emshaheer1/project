import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Refunds & Returns" };

const refundPoints = [
  {
    title: "Damaged or incorrect orders",
    text: "If you receive a damaged, incorrect, or incomplete order, contact support within 7 days of delivery with your order number and clear photos of the issue.",
  },
  {
    title: "Opened research materials",
    text: "Because of the nature of research chemicals, opened vials generally cannot be returned. Unopened products may be eligible for exchange or store credit at our discretion.",
  },
  {
    title: "Approved refunds",
    text: "Approved refunds are issued to the original payment method. Processing may take several business days depending on your bank or card issuer.",
  },
  {
    title: "How to start a request",
    text: "Email support@apollopeptides.co with your order number, a short description of the issue, and any supporting photos to begin a return or refund request.",
  },
];

export default function RefundsPage() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Customer Care"
        title="Refunds & Returns"
        description="Our policy for damaged, incorrect, or incomplete orders—and how to request support with confidence."
      />

      <div className="container-site mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)]">
            <p className="eyebrow">Start a request</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--navy)]">
              Need help with an order?
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Reach out within 7 days of delivery for damaged, incorrect, or
              incomplete shipments. Include your order number and photos.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/contact" className="btn btn-dark w-full">
                Contact support
              </Link>
              <Link href="/shipping" className="btn btn-outline w-full">
                Shipping info
              </Link>
              <Link href="/faqs" className="btn btn-outline w-full">
                View FAQs
              </Link>
            </div>
            <div className="mt-7 rounded-[var(--radius)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
              Email{" "}
              <a
                href="mailto:support@apollopeptides.co"
                className="font-semibold text-[var(--accent)] hover:underline"
              >
                support@apollopeptides.co
              </a>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
              Returns Policy
            </h2>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>

          {refundPoints.map((point, i) => (
            <article
              key={point.title}
              className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-sm)] md:p-7"
            >
              <div className="flex gap-4">
                <span className="font-semibold tabular-nums text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--navy)]">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {point.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
