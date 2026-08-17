import Link from "next/link";

type BackLinkProps = {
  href: string;
  label: string;
  className?: string;
};

/** Context-aware back link for nested / detail / checkout flows. */
export function BackLink({ href, label, className = "" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-[13px] font-medium tracking-wide text-[var(--muted)] transition hover:text-[var(--navy)] ${className}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--navy)] shadow-[var(--shadow-sm)] transition group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14.5 6.5 9 12l5.5 5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label}
    </Link>
  );
}
