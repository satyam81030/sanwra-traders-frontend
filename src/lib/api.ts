export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  size: string;
  category: string;
  available: boolean;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

const DEFAULT_API = "http://127.0.0.1:4311";

export function getApiBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") {
    return DEFAULT_API;
  }
  return DEFAULT_API;
}

export function resolveImageUrl(imageUrl?: string): string {
  if (!imageUrl) return "";
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }
  return `${getApiBase()}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = (data as { error?: string }).error || `Request failed (${res.status})`;
    throw new Error(error);
  }
  return data as T;
}

export async function fetchProducts(params?: {
  available?: boolean;
  category?: string;
}): Promise<Product[]> {
  const q = new URLSearchParams();
  if (params?.available === true) q.set("available", "true");
  if (params?.available === false) q.set("available", "false");
  if (params?.category) q.set("category", params.category);
  const qs = q.toString();
  const res = await fetch(`${getApiBase()}/api/products${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
  const data = await parseJson<{ products: Product[] }>(res);
  return data.products;
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${getApiBase()}/api/products/${id}`, { cache: "no-store" });
  const data = await parseJson<{ product: Product }>(res);
  return data.product;
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${getApiBase()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJson<{ token: string; admin: { email: string; role: string } }>(res);
}

export async function adminMe(token: string) {
  const res = await fetch(`${getApiBase()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ admin: { email: string; role: string } }>(res);
}

export async function createProduct(token: string, form: FormData) {
  const res = await fetch(`${getApiBase()}/api/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return parseJson<{ product: Product }>(res);
}

export async function updateProduct(token: string, id: string, form: FormData) {
  const res = await fetch(`${getApiBase()}/api/products/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return parseJson<{ product: Product }>(res);
}

export async function deleteProduct(token: string, id: string) {
  const res = await fetch(`${getApiBase()}/api/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ ok: boolean }>(res);
}

export const CATEGORIES = [
  { value: "shirts", label: "Shirts" },
  { value: "trousers", label: "Trousers" },
  { value: "dresses", label: "Dresses" },
  { value: "outerwear", label: "Outerwear" },
  { value: "knitwear", label: "Knitwear" },
  { value: "accessories", label: "Accessories" },
  { value: "other", label: "Other" },
] as const;
