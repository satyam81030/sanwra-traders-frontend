"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProduct, resolveImageUrl, type Product } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    let cancelled = false;
    setLoading(true);
    fetchProduct(params.id)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "Product not found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  return (
    <main className="texture-panel min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8">
        <Link href="/" className="font-display text-2xl text-ink">
          Sanwra Traders
        </Link>
        <Link href="/#collection" className="text-sm text-ink/60 hover:text-ink">
          ← Back to collection
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        {loading && (
          <div className="grid animate-pulse gap-10 md:grid-cols-2">
            <div className="aspect-[3/4] bg-ink/10" />
            <div className="space-y-4 pt-8">
              <div className="h-8 w-2/3 bg-ink/10" />
              <div className="h-4 w-1/3 bg-ink/10" />
              <div className="h-24 w-full bg-ink/10" />
            </div>
          </div>
        )}

        {error && (
          <div className="border border-rust/30 bg-rust/5 px-5 py-10 text-center">
            <p className="font-display text-2xl text-ink">Piece not found</p>
            <p className="mt-2 text-sm text-ink/60">{error}</p>
            <Link href="/" className="mt-6 inline-block text-sm text-moss underline">
              Return home
            </Link>
          </div>
        )}

        {product && !loading && (
          <article className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div className="relative aspect-[3/4] overflow-hidden bg-ink/5 animate-fade">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveImageUrl(product.imageUrl)}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-ink/40">No image</div>
              )}
            </div>
            <div className="flex flex-col justify-center animate-rise">
              <p className="text-xs uppercase tracking-[0.22em] text-moss">
                {product.category}
                {!product.available ? " · Sold" : " · Available"}
              </p>
              <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">{product.name}</h1>
              <p className="mt-4 text-xl text-ink/80">
                {formatPrice(product.price, product.currency)}
              </p>
              <p className="mt-2 text-sm text-ink/55">Size {product.size}</p>
              <p className="mt-8 max-w-prose leading-relaxed text-ink/70">{product.description}</p>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
