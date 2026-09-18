import type { Product } from "@/lib/api";
import { sortProductsByDose } from "@/lib/productSort";
import { getSupabase } from "@/lib/supabase";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAt: number | null;
  imageUrl: string;
  category: string;
  featured: boolean;
  inStock: boolean;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    compareAt: row.compareAt,
    imageUrl: row.imageUrl,
    category: row.category,
    featured: row.featured,
    inStock: row.inStock,
  };
}

export type CatalogQuery = {
  featured?: boolean;
  category?: string;
  search?: string;
  sort?: string;
};

/** Catalog reads go to Supabase directly (not Render) so sleep doesn't block the storefront. */
export async function listProducts(query: CatalogQuery = {}): Promise<Product[]> {
  const supabase = getSupabase();
  let q = supabase.from("Product").select(
    "id, slug, name, description, price, compareAt, imageUrl, category, featured, inStock"
  );

  if (query.featured) q = q.eq("featured", true);
  if (query.category) q = q.eq("category", query.category);
  if (query.search?.trim()) {
    const term = query.search.trim().replace(/[%_,]/g, "");
    q = q.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const sort = query.sort || "default";
  if (sort === "price-asc") q = q.order("price", { ascending: true });
  else if (sort === "price-desc") q = q.order("price", { ascending: false });
  else if (sort === "latest") q = q.order("createdAt", { ascending: false });
  else if (sort === "name") q = q.order("name", { ascending: true });

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  const products = (data as ProductRow[] | null)?.map(mapProduct) ?? [];
  if (
    sort === "default" ||
    !["price-asc", "price-desc", "latest", "name"].includes(sort)
  ) {
    return sortProductsByDose(products);
  }
  return products;
}

export async function getProductBySlug(
  slug: string
): Promise<{ product: Product; related: Product[] } | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("Product")
    .select(
      "id, slug, name, description, price, compareAt, imageUrl, category, featured, inStock"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const product = mapProduct(data as ProductRow);
  const { data: relatedRows, error: relatedError } = await supabase
    .from("Product")
    .select(
      "id, slug, name, description, price, compareAt, imageUrl, category, featured, inStock"
    )
    .eq("category", product.category)
    .neq("id", product.id);

  if (relatedError) throw new Error(relatedError.message);

  const related = sortProductsByDose(
    (relatedRows as ProductRow[] | null)?.map(mapProduct) ?? []
  ).slice(0, 4);

  return { product, related };
}
