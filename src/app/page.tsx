import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ProductGrid } from "@/components/product-grid";

export default function HomePage() {
  return (
    <main className="texture-panel min-h-screen">
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="hero-wash absolute inset-0 animate-fade" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/20" />
        <SiteHeader />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
          <p className="animate-rise text-xs uppercase tracking-[0.28em] text-paper/70">
            Clothes trading · Current season
          </p>
          <h1 className="animate-rise mt-4 max-w-3xl font-display text-5xl leading-[1.05] text-paper md:text-7xl lg:text-8xl">
            Sanwra Traders
          </h1>
          <p
            className="animate-rise mt-5 max-w-lg text-base leading-relaxed text-paper/85 md:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Honest garments with room to move — shirts, trousers, and pieces we would wear ourselves.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
            <a
              href="#collection"
              className="inline-flex h-12 items-center bg-paper px-6 text-sm font-medium text-ink transition hover:bg-sand"
            >
              Browse collection
            </a>
            <Link
              href="/admin"
              className="inline-flex h-12 items-center border border-paper/40 px-6 text-sm font-medium text-paper transition hover:bg-paper/10"
            >
              Manage stock
            </Link>
          </div>
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-moss">On the floor</p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">The collection</h2>
          <p className="mt-4 text-ink/65">
            Each piece is listed with size, category, and availability. Tap through for the full story.
          </p>
        </div>
        <ProductGrid />
      </section>

      <footer className="border-t border-ink/10 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-ink/55 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-lg text-ink">Sanwra Traders</p>
          <p>Clothes with a clear provenance — traded carefully, worn often.</p>
        </div>
      </footer>
    </main>
  );
}
