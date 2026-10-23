"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts, resolveImageUrl, type Product } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export function ProductGrid() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "Could not load the collection.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="border border-rust/30 bg-rust/5 px-5 py-8 text-center text-sm text-rust">
        <p className="font-medium">The collection could not be loaded.</p>
        <p className="mt-2 text-ink/60">{error}</p>
        <p className="mt-3 text-ink/50">
          Confirm the API is running and <code className="text-xs">NEXT_PUBLIC_API_URL</code> is
          set.
        </p>
      </div>
    );
  }

  if (!products) {
    return (
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="aspect-[3/4] bg-ink/10" />
            <div className="h-4 w-2/3 bg-ink/10" />
            <div className="h-3 w-1/3 bg-ink/10" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <p className="font-display text-3xl text-ink">Nothing on the rack yet</p>
        <p className="mt-3 text-ink/60">
          Check back soon — fresh pieces land here as soon as they arrive.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <li
          key={product.id}
          className="group animate-rise"
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        >
          <Link href={`/products/${product.id}`} className="block">
            <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveImageUrl(product.imageUrl)}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-ink/40">
                  No image
                </div>
              )}
              {!product.available && (
                <span className="absolute left-3 top-3 bg-ink/85 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-paper">
                  Sold
                </span>
              )}
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-ink transition group-hover:text-moss">
                {product.name}
              </h3>
              <p className="shrink-0 text-sm text-ink/70">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
            <p className="mt-1 text-sm text-ink/50">
              {product.size} · {product.category}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
