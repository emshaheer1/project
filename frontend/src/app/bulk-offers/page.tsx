import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/api";
import { listProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Bulk Offers" };
export const dynamic = "force-dynamic";

async function getBulk(): Promise<Product[]> {
  try {
    return await listProducts({ category: "Bulk" });
  } catch {
    return [];
  }
}

const benefits = [
  {
    title: "Volume pricing",
    text: "Multi-packs and larger vials priced for extended research protocols and lab-scale purchasing.",
  },
  {
    title: "Free shipping threshold",
    text: "Orders over $200 ship free automatically—ideal for consolidating bulk inventory buys.",
  },
  {
    title: "Custom quotes",
    text: "Need recurring supply or institutional quantities? Contact us for a tailored bulk proposal.",
  },
];

export default async function BulkOffersPage() {
  const products = await getBulk();

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Volume Pricing"
        title="Bulk Offers"
        description="Multi-packs and larger vial sizes for research labs that need consistent supply, extended protocols, and better per-unit value."
      />

      <div className="container-site mt-12 space-y-12">
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
              Why Buy Bulk
            </h2>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((item, i) => (
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
        </section>

        <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)]">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border-b border-[var(--line)] p-8 md:p-10 lg:border-r lg:border-b-0">
              <p className="eyebrow">Lab supply</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[var(--navy)] md:text-3xl">
                Order in volume
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] md:text-[0.95rem]">
                Free shipping on orders over $200. For custom institutional quotes
                or recurring lab supply, reach out to our support team and we’ll
                put together a tailored bulk proposal.
              </p>
              <p className="mt-5 text-sm font-medium text-[var(--navy)]">
                {products.length} bulk offerings available
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 bg-[var(--surface)] p-8 md:p-10">
              <Link href="/contact" className="btn btn-dark w-full justify-center">
                Request a quote
              </Link>
              <Link href="/shop" className="btn btn-outline w-full justify-center">
                View full catalog
              </Link>
              <Link href="/shipping" className="btn btn-outline w-full justify-center">
                Shipping details
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-sm font-semibold tracking-[0.14em] text-[var(--navy)] uppercase">
              Bulk Products
            </h2>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>

          {products.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-8 text-sm leading-7 text-[var(--muted)] shadow-[var(--shadow-sm)]">
              Bulk products will load when the API is available. Visit the{" "}
              <Link
                href="/shop"
                className="font-semibold text-[var(--accent)] hover:underline"
              >
                full shop
              </Link>
              .
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
