import type { Product } from "@/lib/api";

export const CATEGORY_ORDER = [
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
  "Bulk",
] as const;

function categoryRank(category: string) {
  const index = (CATEGORY_ORDER as readonly string[]).indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length + 1 : index;
}

function extractDose(product: Pick<Product, "name" | "slug">): number {
  const fromBb = product.name.match(/\bBB\s*(\d+)\b/i) || product.slug.match(/\bbb(\d+)\b/i);
  if (fromBb) return Number(fromBb[1]);

  const fromName = product.name.match(/(\d+(?:\.\d+)?)\s*(mg|ml)\b/i);
  if (fromName) return Number(fromName[1]);

  const fromSlug = product.slug.match(/(?:^|-)(\d+)(?:mg|ml)?(?:-|$)/i);
  if (fromSlug) return Number(fromSlug[1]);

  return Number.POSITIVE_INFINITY;
}

export function sortProductsByDose(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const categoryDiff = categoryRank(a.category) - categoryRank(b.category);
    if (categoryDiff !== 0) return categoryDiff;

    const doseDiff = extractDose(a) - extractDose(b);
    if (doseDiff !== 0) return doseDiff;

    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
  });
}
