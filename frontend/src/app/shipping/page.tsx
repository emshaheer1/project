import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Shipping" };

const shippingPoints = [
  {
    title: "Processing time",
    text: "Orders typically ship within 48 hours of payment confirmation so your research materials leave our facility quickly.",
  },
  {
    title: "Carriers",
    text: "We ship via USPS Priority or Express within the United States. Delivery times vary by destination and carrier conditions.",
  },
  {
    title: "Free shipping",
    text: "Free shipping applies automatically to orders over $200. No coupon needed—the discount appears at checkout.",
  },
  {
    title: "Standard rate",
    text: "Orders under $200 include a flat shipping rate of $9.99 at checkout.",
  },
  {
    title: "Tracking",
    text: "Tracking information is emailed when your package leaves our facility so you can follow delivery status.",
  },
];

export default function ShippingPage() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Fulfillment"
        title="Shipping Information"
        description="Clear details on processing times, carriers, free shipping thresholds, and how tracking works for every order."
      />

      <div className="container-site mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)]">
            <p className="eyebrow">Need help?</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--navy)]">
              Order support
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Questions about a shipment, delivery window, or bulk fulfillment?
              Our team can help.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/contact" className="btn btn-dark w-full">
                Contact support
              </Link>
              <Link href="/refunds" className="btn btn-outline w-full">
                Refunds & returns
              </Link>
              <Link href="/faqs" className="btn btn-outline w-full">
                View FAQs
              </Link>
            </div>
            <div className="mt-7 rounded-[var(--radius)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
              Free shipping on orders over $200
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
              Shipping Policy
            </h2>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>

          {shippingPoints.map((point, i) => (
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
