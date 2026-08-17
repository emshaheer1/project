type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] bg-[linear-gradient(145deg,var(--navy-deep),var(--navy-mid))] text-white">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="container-site relative py-14 md:py-16">
        <p className="eyebrow !text-[var(--gold-soft)] animate-fade-up">{eyebrow}</p>
        <h1 className="mt-3 max-w-2xl text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-tight tracking-[-0.02em] animate-fade-up-delay">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base animate-fade-up-delay">
          {description}
        </p>
      </div>
    </section>
  );
}
