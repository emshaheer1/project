import Link from "next/link";
import { HeroDnaBackground } from "@/components/HeroDnaBackground";
import { HomeClient } from "@/components/HomeClient";
import { ProductMarquee } from "@/components/ProductMarquee";
import { api, type Product } from "@/lib/api";

export const dynamic = "force-dynamic";

async function getFeatured(): Promise<Product[]> {
  try {
    const data = await api<{ products: Product[] }>("/api/products?featured=true");
    return data.products;
  } catch {
    return [];
  }
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const data = await api<{ products: Product[] }>("/api/products");
    return data.products;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, allProducts] = await Promise.all([getFeatured(), getAllProducts()]);

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden text-white">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 60% at 15% 20%, rgba(26,155,176,0.28), transparent 50%), radial-gradient(ellipse 50% 45% at 85% 15%, rgba(184,149,58,0.2), transparent 45%), linear-gradient(145deg, #06101c 0%, #0b1f36 48%, #143354 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <HeroDnaBackground />

        <div className="container-site relative grid min-h-[88vh] items-center gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="animate-fade-up eyebrow !text-[var(--gold-soft)]">
              Alpha Peptides
            </p>
            <h1 className="animate-fade-up-delay mt-4 max-w-2xl font-[family-name:var(--font-poppins)] text-[clamp(1.85rem,3.2vw,2.65rem)] font-semibold leading-[1.2] tracking-[-0.015em]">
              Exceptional Quality That You Can Trust
            </h1>
            <p className="animate-fade-up-delay-2 mt-5 max-w-2xl text-[0.95rem] leading-8 text-white/72 md:text-base md:leading-8">
              We supply high-purity research peptides for laboratories and qualified
              researchers who need reliable compounds they can document with confidence.
              Every product is third-party tested for identity and purity, handled under
              strict quality controls, and shipped promptly so your work stays on schedule.
              Choose Alpha Peptides for transparent testing data, competitive pricing, and support
              built around serious scientific research—not marketing claims.
            </p>
            <div className="animate-fade-up-delay-2 mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary btn-lg">
                Shop Our Products
              </Link>
              <Link href="/bulk-offers" className="btn btn-secondary btn-lg">
                Bulk Offers
              </Link>
            </div>
            <div className="animate-fade-up-delay-2 mt-10 max-w-2xl border-t border-white/12 pt-6">
              <ul className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-0 sm:divide-x sm:divide-white/15">
                {[
                  {
                    label: "Not for Human Consumption",
                    icon: (
                      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M7.5 7.5l9 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    label: "Research Use Only",
                    icon: (
                      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M9 3h6M10 3v6.2L6.8 15.5A3.2 3.2 0 0 0 9.6 20.5h4.8a3.2 3.2 0 0 0 2.8-5L14 9.2V3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Laboratory Purposes",
                    icon: (
                      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M4 19h16M7 19V9l5-5 5 5v10"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M10 19v-4h4v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 sm:flex-1 sm:justify-center sm:px-4 first:sm:pl-0 last:sm:pr-0"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(184,149,58,0.35)] bg-[rgba(184,149,58,0.1)] text-[var(--gold-soft)]">
                      {item.icon}
                    </span>
                    <span className="text-[13px] font-medium leading-snug tracking-wide text-white/78">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative hidden min-h-[440px] lg:block">
            <div className="absolute inset-10 rounded-full border border-[rgba(46,184,207,0.2)] animate-pulse-soft" />
            <div className="absolute inset-16 rounded-full border border-[rgba(184,149,58,0.15)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-float w-full max-w-sm rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-9 backdrop-blur-md">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[var(--accent-soft)] uppercase">
                  Premium Research Supply
                </p>
                <p className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-snug">
                  Verifiable purity. Fast shipping. Superior support.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                  {[
                    ["48h", "Ship"],
                    ["3rd", "Party"],
                    ["100%", "Research"],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <p className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
                        {value}
                      </p>
                      <p className="mt-1 text-[10px] tracking-wider text-white/45 uppercase">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductMarquee products={allProducts} />

      <HomeClient featured={featured} />
    </>
  );
}
