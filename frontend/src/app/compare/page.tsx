"use client";

import Link from "next/link";
import Image from "next/image";
import { BackLink } from "@/components/BackButton";
import { useCompare } from "@/context/CompareContext";
import { formatPrice } from "@/lib/api";

export default function ComparePage() {
  const { items, remove, clear } = useCompare();

  if (!items.length) {
    return (
      <div className="container-site py-16 text-center">
        <h1 className="section-title">Compare</h1>
        <p className="mt-3 text-[var(--muted)]">Add up to 3 products to compare.</p>
        <Link href="/shop" className="btn btn-dark mt-6 inline-flex">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-12">
      <BackLink href="/shop" label="Back to shop" className="mb-6" />
      <div className="flex items-center justify-between gap-4">
        <h1 className="section-title">Compare</h1>
        <button className="btn btn-outline" onClick={clear}>
          Clear all
        </button>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border border-[var(--line)] bg-[var(--white)] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)]">
              <th className="p-4">Product</th>
              {items.map((item) => (
                <th key={item.id} className="p-4">
                  <div className="relative mb-3 h-28 w-28 overflow-hidden bg-[var(--navy)]">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  <Link href={`/product/${item.slug}`} className="font-[family-name:var(--font-display)] text-lg text-[var(--navy)]">
                    {item.name}
                  </Link>
                  <button
                    className="mt-2 block text-xs text-[var(--danger)]"
                    onClick={() => remove(item.id)}
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--line)]">
              <td className="p-4 text-[var(--muted)]">Price</td>
              {items.map((item) => (
                <td key={item.id} className="p-4">
                  {formatPrice(item.price)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--line)]">
              <td className="p-4 text-[var(--muted)]">Category</td>
              {items.map((item) => (
                <td key={item.id} className="p-4">
                  {item.category}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[var(--muted)]">Description</td>
              {items.map((item) => (
                <td key={item.id} className="p-4 align-top leading-6">
                  {item.description}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
