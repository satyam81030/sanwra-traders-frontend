"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CATEGORIES,
  adminLogin,
  adminMe,
  createProduct,
  deleteProduct,
  fetchProducts,
  resolveImageUrl,
  updateProduct,
  type Product,
} from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  name: string;
  description: string;
  price: string;
  size: string;
  category: string;
  available: boolean;
  imageUrl: string;
  imageFile: File | null;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  size: "M",
  category: "shirts",
  available: true,
  imageUrl: "",
  imageFile: null,
};

export default function AdminPage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [email, setEmail] = useState("admin@sanwratraders.com");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [loginBusy, setLoginBusy] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const list = await fetchProducts();
      setProducts(list);
      setListError(null);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to load products");
    }
  }, []);

  useEffect(() => {
    const existing = getToken();
    if (!existing) {
      setChecking(false);
      return;
    }
    adminMe(existing)
      .then(() => {
        setTokenState(existing);
        return refresh();
      })
      .catch(() => {
        clearToken();
        setTokenState(null);
      })
      .finally(() => setChecking(false));
  }, [refresh]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoginBusy(true);
    try {
      const res = await adminLogin(email, password);
      setToken(res.token);
      setTokenState(res.token);
      toast.success("Signed in");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginBusy(false);
    }
  }

  function logout() {
    clearToken();
    setTokenState(null);
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      size: product.size,
      category: product.category,
      available: product.available,
      imageUrl: product.imageUrl?.startsWith("http") ? product.imageUrl : "",
      imageFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const data = new FormData();
      data.set("name", form.name.trim());
      data.set("description", form.description.trim());
      data.set("price", form.price);
      data.set("size", form.size.trim());
      data.set("category", form.category);
      data.set("available", String(form.available));
      if (form.imageFile) {
        data.set("image", form.imageFile);
      } else if (form.imageUrl.trim()) {
        data.set("imageUrl", form.imageUrl.trim());
      }

      if (editingId) {
        await updateProduct(token, editingId, data);
        toast.success("Product updated");
      } else {
        await createProduct(token, data);
        toast.success("Product added");
      }
      cancelEdit();
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!token) return;
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(token, id);
      toast.success("Deleted");
      if (editingId === id) cancelEdit();
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (checking) {
    return (
      <main className="texture-panel flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-ink/50">Checking session…</p>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="texture-panel min-h-screen">
        <header className="mx-auto flex max-w-lg items-center justify-between px-5 py-6">
          <Link href="/" className="font-display text-2xl text-ink">
            Sanwra Traders
          </Link>
          <Link href="/" className="text-sm text-ink/55 hover:text-ink">
            Storefront
          </Link>
        </header>
        <div className="mx-auto max-w-lg px-5 pb-16">
          <h1 className="font-display text-4xl text-ink">Admin</h1>
          <p className="mt-2 text-sm text-ink/60">
            Sign in with the single admin account configured on the API.
          </p>
          <form onSubmit={onLogin} className="mt-8 space-y-4 border border-ink/10 bg-paper/80 p-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginBusy}>
              {loginBusy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="texture-panel min-h-screen">
      <header className="border-b border-ink/10 bg-paper/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 md:px-8">
          <div>
            <Link href="/" className="font-display text-2xl text-ink">
              Sanwra Traders
            </Link>
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Admin · stock desk</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-ink/55 hover:text-ink">
              View store
            </Link>
            <Button variant="outline" size="sm" type="button" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-12 px-5 py-10 md:px-8 lg:grid-cols-[1fr_1.1fr]">
        <section>
          <h2 className="font-display text-3xl text-ink">
            {editingId ? "Edit piece" : "Add a piece"}
          </h2>
          <p className="mt-2 text-sm text-ink/55">
            Upload a photo or paste an image URL. Cloudinary is used when configured on the API.
          </p>
          <form onSubmit={onSave} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price (INR)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={form.size}
                  onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-11 w-full border border-ink/15 bg-paper px-3 text-sm"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="available">Availability</Label>
                <select
                  id="available"
                  className="flex h-11 w-full border border-ink/15 bg-paper px-3 text-sm"
                  value={form.available ? "true" : "false"}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, available: e.target.value === "true" }))
                  }
                >
                  <option value="true">Available</option>
                  <option value="false">Sold / unavailable</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Picture upload</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageFile: e.target.files?.[0] ?? null }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Or image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://…"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Save changes" : "Add product"}
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="font-display text-3xl text-ink">Inventory</h2>
          {listError && (
            <p className="mt-3 border border-rust/30 bg-rust/5 px-3 py-2 text-sm text-rust">
              {listError}
            </p>
          )}
          <ul className="mt-6 space-y-4">
            {products.length === 0 && !listError && (
              <li className="text-sm text-ink/50">No products yet — add the first piece.</li>
            )}
            {products.map((p) => (
              <li key={p.id} className="flex gap-4 border border-ink/10 bg-paper/70 p-3">
                <div className="h-20 w-16 shrink-0 overflow-hidden bg-ink/5">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveImageUrl(p.imageUrl)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{p.name}</p>
                  <p className="text-sm text-ink/55">
                    {formatPrice(p.price, p.currency)} · {p.size} · {p.category}
                    {!p.available ? " · sold" : ""}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => startEdit(p)}>
                      Edit
                    </Button>
                    <Button type="button" size="sm" variant="danger" onClick={() => onDelete(p.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
