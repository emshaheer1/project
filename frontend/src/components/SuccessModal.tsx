"use client";

type SuccessModalProps = {
  open: boolean;
  title: string;
  message?: string;
  onClose: () => void;
};

export function SuccessModal({ open, title, message, onClose }: SuccessModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(11,31,54,0.55)] p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div className="w-full max-w-sm overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-lg)]">
        <div className="flex flex-col items-center px-6 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(26,155,176,0.12)] text-[var(--accent)]">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path
                d="M8 12.5l2.5 2.5L16 9.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2
            id="success-modal-title"
            className="mt-5 text-xl font-semibold text-[var(--navy)]"
          >
            {title}
          </h2>
          {message ? (
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{message}</p>
          ) : null}
          <button type="button" className="btn btn-dark mt-6 w-full" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
