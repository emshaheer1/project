"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/api";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = subtotal >= 200 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShipProgress = Math.min(100, (subtotal / 200) * 100);
  const freeShipRemaining = Math.max(0, 200 - subtotal);

  if (!items.length) {
    return (
      <div className="container-site py-20 md:py-28">
        <div className="mx-auto max-w-lg rounded-[var(--radius-lg)] border border-[var(--line)] bg-white px-8 py-14 text-center shadow-[var(--shadow-sm)] animate-fade-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 5h2l1.6 9.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21 8H7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.2" fill="currentColor" />
              <circle cx="18" cy="20" r="1.2" fill="currentColor" />
            </svg>
          </div>
          <p className="eyebrow mx-auto mt-6">Cart</p>
          <h1 className="section-title mt-3 !mb-0">Your cart is empty</h1>
          <p className="mx-auto mt-3 max-w-sm text-[var(--muted)]">
            Browse the catalog and add research materials when you&apos;re ready.
          </p>
          <Link href="/shop" className="btn btn-dark btn-lg mt-8 inline-flex">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="border-b border-[var(--line)] bg-white/70 backdrop-blur-sm">
        <div className="container-site flex flex-wrap items-end justify-between gap-3 py-8 md:py-10">
          <div>
            <p className="eyebrow animate-fade-up">Checkout</p>
            <h1 className="section-title mt-2 !mb-0 animate-fade-up-delay">Your cart</h1>
          </div>
          <p className="text-sm text-[var(--muted)] animate-fade-up-delay">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <div className="container-site mt-8 md:mt-10">
        <div className="grid gap-8 lg:grid-cols-[1.45fr_0.85fr] lg:gap-10">
          <div className="space-y-4">
            {freeShipRemaining > 0 ? (
              <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white px-5 py-4 shadow-[var(--shadow-sm)] animate-fade-up">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <p className="text-[var(--navy)]">
                    Add <span className="font-semibold">{formatPrice(freeShipRemaining)}</span> more for free shipping
                  </p>
                  <span className="text-xs font-medium text-[var(--muted)]">Orders over $200</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                    style={{ width: `${freeShipProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--success)_25%,var(--line))] bg-[color-mix(in_srgb,var(--success)_8%,white)] px-5 py-3.5 text-sm font-medium text-[var(--success)] animate-fade-up">
                You qualify for free shipping.
              </div>
            )}

            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-sm)] animate-fade-up">
              {items.map((item, index) => (
                <div
                  key={item.product.id}
                  className={`grid grid-cols-[88px_1fr] gap-4 p-4 sm:grid-cols-[104px_1fr_auto] sm:gap-5 sm:p-5 ${
                    index > 0 ? "border-t border-[var(--line)]" : ""
                  }`}
                >
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="relative h-[88px] w-[88px] overflow-hidden rounded-[var(--radius)] bg-[#070d14] sm:h-[104px] sm:w-[104px]"
                  >
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  </Link>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
                      {item.product.category}
                    </p>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="mt-1 block truncate text-lg font-semibold text-[var(--navy)] transition hover:text-[var(--accent)]"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {formatPrice(item.product.price)} each
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="inline-flex h-10 items-center overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)]">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.product.name} quantity`}
                          className="flex h-full w-9 items-center justify-center text-[var(--navy)] transition hover:bg-white"
                          onClick={() =>
                            updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                          }
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-[var(--navy)]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.product.name} quantity`}
                          className="flex h-full w-9 items-center justify-center text-[var(--navy)] transition hover:bg-white"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--danger)]"
                        onClick={() => removeItem(item.product.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <p className="mt-3 text-base font-semibold text-[var(--navy)] sm:hidden">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>

                  <div className="hidden self-start text-right sm:block">
                    <p className="text-lg font-semibold text-[var(--navy)]">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--navy)]"
            >
              ← Continue shopping
            </Link>
          </div>

          <aside className="h-fit rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-md)] animate-fade-up-delay lg:sticky lg:top-28">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--navy)]">
              Order summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Subtotal</span>
                <span className="font-medium text-[var(--navy)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Shipping</span>
                <span className="font-medium text-[var(--navy)]">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-[var(--line)] pt-4 text-base">
                <span className="font-semibold text-[var(--navy)]">Total</span>
                <span className="font-bold text-[var(--accent)]">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn btn-dark btn-lg mt-6 w-full">
              Proceed to checkout
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-[var(--muted)]">
              Secure checkout · Research use only · Free shipping over $200
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
