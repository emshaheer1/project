import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "FAQs" };

const faqGroups = [
  {
    title: "Products & Research Use",
    items: [
      {
        q: "Are these products for human consumption?",
        a: "No. All products sold by Alpha Peptides are intended strictly for laboratory research purposes only. They are not for human or animal consumption, injection, or household use.",
      },
      {
        q: "Are products third-party tested?",
        a: "Yes. Products are routinely tested by independent laboratories for identity and purity. Certificates of Analysis (COAs) are available to support your research documentation.",
      },
      {
        q: "Who can purchase from Alpha Peptides?",
        a: "Purchases are intended for qualified independent researchers, industrial or materials research labs, universities, educational institutions, and biotechnology companies who understand proper handling and storage.",
      },
    ],
  },
  {
    title: "Orders & Shipping",
    items: [
      {
        q: "How fast do orders ship?",
        a: "Orders typically ship within 48 hours of payment confirmation. We ship via USPS Priority or Express within the United States, and tracking is provided once your package leaves our facility.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes. Free shipping is applied automatically on orders over $200. Orders under $200 include a flat shipping rate shown at checkout.",
      },
      {
        q: "How do bulk orders work?",
        a: "Browse our Bulk Offers page for multi-packs and larger vial sizes. For custom institutional quantities or recurring supply, contact our team for a tailored quote.",
      },
    ],
  },
  {
    title: "Returns & Support",
    items: [
      {
        q: "What is your refund policy?",
        a: "If you receive a damaged, incorrect, or incomplete order, contact support within 7 days of delivery with your order number and photos. Because of the nature of research materials, opened vials generally cannot be returned. See our Refunds page for full details.",
      },
      {
        q: "How can I contact support?",
        a: "Email support@apollopeptides.co anytime with questions about products, shipping, or your account. We aim to respond promptly and resolve issues under our satisfaction guarantee.",
      },
    ],
  },
];

export default function FaqsPage() {
  let index = 0;

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Support Center"
        title="Frequently Asked Questions"
        description="Clear answers about research-use products, shipping, testing, and account support—so you can order with confidence."
      />

      <div className="container-site mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-7 shadow-[var(--shadow-sm)]">
            <p className="eyebrow">Need more help?</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--navy)]">
              Still have questions?
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Our team can help with product details, bulk pricing, shipping
              status, and research documentation requests.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/contact" className="btn btn-dark w-full">
                Contact support
              </Link>
              <Link href="/shipping" className="btn btn-outline w-full">
                Shipping info
              </Link>
              <Link href="/refunds" className="btn btn-outline w-full">
                Refunds policy
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

        <div className="space-y-10">
          {faqGroups.map((group) => (
            <section key={group.title}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
                  {group.title}
                </h2>
                <div className="h-px flex-1 bg-[var(--line)]" />
              </div>

              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]">
                {group.items.map((faq) => {
                  index += 1;
                  const num = String(index).padStart(2, "0");
                  return (
                    <details
                      key={faq.q}
                      className="group border-b border-[var(--line)] last:border-b-0 open:bg-[linear-gradient(180deg,#f8fbfd_0%,#ffffff_100%)]"
                    >
                      <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-5 transition marker:content-none hover:bg-[var(--surface)] [&::-webkit-details-marker]:hidden md:px-6 md:py-5">
                        <span className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--accent)]">
                          {num}
                        </span>
                        <span className="flex-1 text-[0.98rem] font-semibold leading-snug text-[var(--navy)] md:text-base">
                          {faq.q}
                        </span>
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[var(--line)] bg-white text-[var(--navy)] transition group-open:border-[var(--navy)] group-open:bg-[var(--navy)] group-open:text-white">
                          <svg
                            className="h-4 w-4 transition duration-300 group-open:rotate-45"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 5v14M5 12h14"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-5 pb-5 md:px-6">
                        <div className="ml-9 border-l-2 border-[var(--accent)]/30 pl-4 text-sm leading-7 text-[var(--muted)] md:ml-10">
                          {faq.a}
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
