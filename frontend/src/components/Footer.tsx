import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--navy-deep)] text-white/80">
      <div className="h-1 bg-[linear-gradient(90deg,var(--accent),var(--gold),var(--accent))]" />
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            aria-label="Alpha Peptides home"
            className="relative mb-1 block h-[56px] w-[240px] md:h-[64px] md:w-[272px]"
          >
            <Image
              src="/logo-alpha-peptides.png"
              alt="Alpha Peptides"
              fill
              className="object-contain object-left"
              sizes="272px"
            />
          </Link>
          <div className="divider-accent" />
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
            The statements on this website have not been evaluated by the FDA.
            Products are sold for research, laboratory, or analytical purposes
            only and are not for human consumption.
          </p>
        </div>
        <div>
          <h4 className="mb-5 text-[11px] font-semibold tracking-[0.2em] text-[var(--gold-soft)] uppercase">
            Quick Links
          </h4>
          <div className="flex flex-col gap-2.5 text-sm">
            {[
              ["/shipping", "Shipping"],
              ["/refunds", "Refunds & Returns"],
              ["/account", "My Account"],
              ["/shop", "Shop"],
              ["/bulk-offers", "Bulk Offers"],
              ["/faqs", "FAQs"],
              ["/contact", "Contact Us"],
              ["/terms", "Terms & Privacy"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="transition hover:translate-x-1 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-5 text-[11px] font-semibold tracking-[0.2em] text-[var(--gold-soft)] uppercase">
            Company
          </h4>
          <p className="text-sm leading-7 text-white/65">
            Alpha Peptides LLC
            <br />
            1000 Town Center Drive
            <br />
            Suite 300 #1043
            <br />
            Oxnard CA 93036
          </p>
          <p className="mt-5 text-sm">
            Email:{" "}
            <a
              className="text-[var(--accent-soft)] transition hover:text-white"
              href="mailto:support@apollopeptides.co"
            >
              support@apollopeptides.co
            </a>
          </p>
          <p className="mt-3 text-xs text-white/40">
            Charges appear as: ALPHA PEPTIDES
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs tracking-wide text-white/40">
        © {new Date().getFullYear()} Alpha Peptides. All Rights Reserved.
      </div>
    </footer>
  );
}
