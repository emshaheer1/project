"use client";

import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import type { Product } from "@/lib/api";

const HOME_CATEGORY_ORDER = [
  "Retatrutide",
  "Tirzepatide",
  "Peptide Blends",
  "BB",
  "Tesamorelin",
  "MOTS-c",
  "NAD+",
  "BPC-157",
  "GHK-Cu",
  "BAC Water",
];

function picksForHome(products: Product[], featured: Product[]) {
  const byCategory = new Map<string, Product[]>();
  for (const p of products) {
    const list = byCategory.get(p.category) || [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const featuredIds = new Set(featured.map((p) => p.id));
  const orderedCategories = HOME_CATEGORY_ORDER.filter((c) => (byCategory.get(c) || []).length);
  const queues = new Map<string, Product[]>();

  for (const category of orderedCategories) {
    const items = byCategory.get(category) || [];
    const preferred = items.filter((p) => featuredIds.has(p.id));
    queues.set(category, preferred.length ? [...preferred, ...items.filter((p) => !featuredIds.has(p.id))] : [...items]);
  }

  // Round-robin across categories so home shows at most 8 products total
  const picks: Product[] = [];
  let index = 0;
  while (picks.length < 8) {
    let added = false;
    for (const category of orderedCategories) {
      if (picks.length >= 8) break;
      const queue = queues.get(category) || [];
      if (index < queue.length) {
        picks.push(queue[index]);
        added = true;
      }
    }
    if (!added) break;
    index += 1;
  }

  return picks;
}

export function HomeClient({
  featured,
  products = [],
}: {
  featured: Product[];
  products?: Product[];
}) {
  const homeProducts = picksForHome(products.length ? products : featured, featured);

  return (
    <>
      <section className="border-b border-[var(--line)] bg-white py-20">
        <div className="container-site stagger grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Verifiable Purity",
              text: "Our products are routinely tested by trusted labs. COAs available for research documentation.",
              step: "01",
            },
            {
              title: "Fast Shipping",
              text: "Orders typically ship within 48 hours via USPS Priority or Express.",
              step: "02",
            },
            {
              title: "Superior Support",
              text: "Complete satisfaction guarantee. Email us anytime if you run into issues.",
              step: "03",
            },
          ].map((item) => (
            <Reveal key={item.title}>
              <div className="surface-card h-full p-7 hover:-translate-y-1">
                <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--accent)]/30">
                  {item.step}
                </span>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--navy)]">
                  {item.title}
                </h2>
                <div className="divider-accent" />
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Our Mission</p>
            <h2 className="section-title mt-3">
              Elevate Your Research with Our Premium Peptides
            </h2>
            <p className="section-lead">
              We’re passionate about advancing scientific boundaries by providing
              top-tier research peptides. Your experiments’ success hinges on the
              purity and stability of your resources.
            </p>
            <Link href="/about" className="btn btn-dark mt-8 inline-flex">
              Learn More
            </Link>
          </Reveal>
          <Reveal>
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[linear-gradient(160deg,var(--navy),var(--navy-mid))] p-9 text-white shadow-[var(--shadow-md)]">
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--accent)]/20 blur-3xl" />
              <p className="relative text-sm leading-8 text-white/75">
                At Alpha Polymers, our passion for science motivates us to
                offer exceptional research chemicals and peptides, enriching your
                scientific discoveries with transparent testing and reliable
                fulfillment.
              </p>
              <p className="relative mt-6 font-[family-name:var(--font-display)] text-2xl leading-snug">
                Quality you can document. Service you can rely on.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-site">
          <Reveal>
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Catalog</p>
                <h2 className="section-title mt-2">Featured Products</h2>
                <p className="section-lead">
                  Eight featured research products from across our catalog.
                </p>
              </div>
              <Link href="/shop" className="btn btn-outline hidden sm:inline-flex">
                View all products
              </Link>
            </div>
          </Reveal>

          {homeProducts.length ? (
            <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {homeProducts.map((product) => (
                <Reveal key={product.id} className="h-full">
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted)]">
              Products will appear once the API is running. Start the backend with{" "}
              <code>npm run dev</code> in <code>/backend</code>.
            </p>
          )}
        </div>
      </section>

      <section className="py-20">
        <Reveal>
          <div className="container-site overflow-hidden rounded-[var(--radius-lg)] bg-[linear-gradient(135deg,var(--navy-deep),var(--navy-mid))] p-8 text-white shadow-[var(--shadow-lg)] md:p-12">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <p className="eyebrow !text-[var(--gold-soft)]">Stay informed</p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-4xl">
                  Sign up for our newsletter
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/65">
                  Become part of the Alpha Polymers community. Get product
                  updates, exclusive offers, and a coupon for free shipping plus 10% off.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
