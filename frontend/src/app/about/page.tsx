import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "About Us" };

const commitments = [
  "Certificate of Analysis (COA) and Endotoxin Reports for products.",
  "Strict quality control for purity and accuracy.",
  "Continuous process improvement and catalog expansion.",
  "Independent third-party laboratory testing before listing.",
];

const pillars = [
  {
    title: "Our Vision",
    text: "To equip researchers with outstanding products and services, guiding you toward revolutionary discoveries with reliable, research-grade materials.",
  },
  {
    title: "Why Choose Us",
    text: "Our products undergo rigorous testing and strict quality control to meet the highest industry standards. Your research deserves nothing but the best.",
  },
  {
    title: "Our Promise",
    text: "Transparent documentation, responsive support, and consistent fulfillment—so your laboratory work stays on schedule with materials you can trust.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Who We Are"
        title="About Alpha Peptides"
        description="We redefine standards for scientific research supply—delivering premium peptides and chemicals with verifiable purity for qualified laboratories."
      />

      <div className="container-site mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)]">
            <p className="eyebrow">Explore</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--navy)]">
              Start researching with Alpha Peptides
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Browse the catalog, review bulk pricing, or contact our team for
              institutional supply questions.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/shop" className="btn btn-dark w-full">
                Shop products
              </Link>
              <Link href="/bulk-offers" className="btn btn-outline w-full">
                Bulk offers
              </Link>
              <Link href="/contact" className="btn btn-outline w-full">
                Contact us
              </Link>
            </div>
            <div className="mt-7 rounded-[var(--radius)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
              Research use only · Not for human consumption
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)] md:p-8">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
              Our Story
            </h2>
            <div className="mt-4 h-px bg-[var(--line)]" />
            <p className="mt-5 text-sm leading-8 text-[var(--muted)] md:text-[0.95rem]">
              Join the Alpha Peptides community, where science and innovation
              intersect. Our dedication is to drive research forward by providing
              researchers with premium research peptides and chemicals. We focus on
              purity, documentation, and dependable fulfillment so your experiments
              can proceed with confidence.
            </p>
          </div>

          <div className="space-y-4">
            <div className="mb-1 flex items-center gap-3">
              <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
                What Guides Us
              </h2>
              <div className="h-px flex-1 bg-[var(--line)]" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {pillars.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-sm)]"
                >
                  <span className="text-sm font-semibold tabular-nums text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--navy)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)] md:p-8">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
              Our Commitment to Excellence
            </h2>
            <div className="mt-4 h-px bg-[var(--line)]" />
            <ul className="mt-5 space-y-4">
              {commitments.map((item, i) => (
                <li key={item} className="flex gap-4 text-sm leading-7 text-[var(--muted)]">
                  <span className="mt-0.5 font-semibold tabular-nums text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="border-l-2 border-[var(--accent)]/30 pl-4">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
