# Sanwra Traders — Frontend

Next.js (App Router) + TypeScript + Tailwind storefront for **Sanwra Traders**. Public catalog with no user auth; admin UI at `/admin` talks to the API with a JWT.

## Stack

- Next.js + React + TypeScript
- Tailwind CSS + shadcn-style UI primitives (`Button`, `Input`, `Label`, `Textarea`)
- Fonts: Fraunces (display) + Manrope (body)
- API client via `NEXT_PUBLIC_API_URL`

## Local development

1. Start the [backend](https://github.com/satyam81030/sanwra-traders-backend) on port **4311** first.
2. Then:

```bash
cp .env.example .env.local
npm install
npm run dev
```

App URL: [http://127.0.0.1:4312](http://127.0.0.1:4312)

Default admin (API env): `admin@sanwratraders.com` / `changeme-admin`

### Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend origin, no trailing slash |

**Production builds must set `NEXT_PUBLIC_API_URL`** to the public API URL. Do not rely on hardcoded localhost in Vercel.

### CORS

On the backend, set `CORS_ORIGIN` to include this frontend’s origin(s), e.g.:

```
https://sanwratraders.com,https://www.sanwratraders.com,https://your-app.vercel.app
```

## Deploy on Vercel

1. Import this GitHub repo in [Vercel](https://vercel.com).
2. Framework preset: **Next.js**.
3. Environment variable: `NEXT_PUBLIC_API_URL` = your Render API URL.
4. Deploy.

### Custom domain `sanwratraders.com`

1. Vercel project → **Settings → Domains**.
2. Add `sanwratraders.com` and `www.sanwratraders.com`.
3. At your DNS provider, follow Vercel’s instructions (typical):
   - **A** record for apex `@` → `76.76.21.21` (confirm in the Domains UI), **or** the ALIAS/ANAME Vercel shows.
   - **CNAME** for `www` → `cname.vercel-dns.com` (or the value Vercel shows).
4. Wait for DNS; Vercel issues HTTPS automatically.
5. Update backend `CORS_ORIGIN` to include both `https://sanwratraders.com` and `https://www.sanwratraders.com`.
