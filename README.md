# Apollo Peptide Store / Alpha Polymers

Full research-peptide e-commerce store: catalog, auth, cart/checkout, wishlist, compare, and account pages.

| Layer | Stack | Host |
|-------|--------|------|
| Frontend | Next.js (App Router) + Tailwind | [Vercel](https://vercel.com) |
| Backend | Express + Prisma + TypeScript | [Render](https://render.com) |
| Database | SQLite (local) / PostgreSQL | [Supabase](https://supabase.com) |

```
Apollo/
  frontend/   → deploy to Vercel
  backend/    → deploy to Render (DATABASE_URL → Supabase)
```

## Local development

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
```

**SQLite (default local):** copy `prisma/schema.sqlite.prisma` over `prisma/schema.prisma`, set `DATABASE_URL="file:./dev.db"` in `.env` (no `DIRECT_URL`).

**Postgres locally:** keep the postgresql schema; set both `DATABASE_URL` and `DIRECT_URL` to the same local Postgres URL.

```bash
npx prisma db push
npm run seed
npm run dev
```

API: `http://localhost:4000`  
Health: `http://localhost:4000/health`

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App: `http://localhost:3000`

Set in `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Environment variables

### Backend (Render)

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Supabase **Transaction pooler** URI (port `6543`, `?pgbouncer=true`) |
| `DIRECT_URL` | Yes | Supabase **Direct** URI (port `5432`) — used by Prisma migrate/db push |
| `JWT_SECRET` | Yes | Long random string (32+ chars) |
| `FRONTEND_URL` | Yes | Your Vercel URL, e.g. `https://your-app.vercel.app` |
| `ADMIN_EMAIL` | Yes (for seed) | Admin login email — no code defaults |
| `ADMIN_PASSWORD` | Yes (for seed) | Strong password (12+ chars, mixed case, number, symbol) |
| `SEED_RESET_ADMIN_PASSWORD` | No | Set `true` only to rotate admin password on seed |
| `PORT` | No | Render sets this automatically |
| `STRIPE_SECRET_KEY` | No | Enables real Stripe Checkout |
| `STRIPE_WEBHOOK_SECRET` | No | For `/api/orders/stripe-webhook` |

### Frontend (Vercel)

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_API_URL` | Yes | Render API URL, e.g. `https://apollo-api.onrender.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Optional; checkout redirects via Stripe session URL from API |

Without Stripe keys, checkout creates a **demo paid** order and redirects to the success page (only if `ALLOW_DEMO_CHECKOUT` is enabled).

## Deploy: Supabase (database)

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → Database → Connect**:
   - **Transaction pooler** → `DATABASE_URL` (append `?pgbouncer=true` if not present).
   - **Direct connection** → `DIRECT_URL`.
3. Schema is applied on Render start via `npx prisma db push` (or run the same locally against Supabase).

App auth stays on the Express API (JWT); Supabase is used as Postgres only.

## Deploy: Render (API)

1. Push this repo to GitHub.
2. Create a **Web Service** from `backend/` (or use root [`render.yaml`](render.yaml) Blueprint — no Render Postgres).
   - **Build:** `npm install --include=dev && npx prisma generate && npm run build`
   - **Pre-Deploy:** `npx prisma db push && npm run seed` (once per deploy only)
   - **Start:** `npm start` (keep this fast — free tier cold-starts only run Start)
3. Set env vars: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. Note the service URL (e.g. `https://apollo-api.onrender.com`).

Set `FRONTEND_URL` after the Vercel app exists so CORS allows the storefront.

## Deploy: Vercel (frontend)

1. Import the repo in Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework: Next.js (auto-detected).
4. Env: `NEXT_PUBLIC_API_URL=https://YOUR-RENDER-API.onrender.com`
5. Deploy.

Update Render `FRONTEND_URL` to your Vercel domain.

## Features

- Age / research-use gate
- Home, shop (search + sort), product detail, bulk offers
- About, FAQs, contact, shipping, refunds, terms
- Cart + checkout (demo or Stripe)
- Register / login / account order history
- Wishlist (local + synced when logged in)
- Compare (up to 3 products)
- Newsletter + contact forms

## Admin dashboard

Open `http://localhost:3000/dashboard/login` (or your Vercel URL + `/dashboard/login`).

There are **no default admin credentials** in the app. Set strong values before seeding:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` (12+ chars, upper, lower, number, special character)
- `JWT_SECRET` (32+ random characters)

Then run `npm run seed` in `/backend` (or let Render start seed). To rotate the admin password later, set `SEED_RESET_ADMIN_PASSWORD=true` and re-seed.

Dashboard sections:

- Overview stats
- Users → Registered Users / Details of Users
- Orders (full table + expandable details)
- Contact Us requests

## Stripe (optional)

1. Add `STRIPE_SECRET_KEY` on Render.
2. Point webhook to `https://YOUR-API/api/orders/stripe-webhook` for `checkout.session.completed`.
3. Set `STRIPE_WEBHOOK_SECRET`.

Checkout will then redirect to Stripe Checkout instead of demo mode.

## Scripts

**Backend**

- `npm run dev` — watch mode
- `npm run build` — compile TypeScript
- `npm start` — run compiled server
- `npm run seed` — seed catalog products

**Frontend**

- `npm run dev` — Next.js dev server
- `npm run build` — production build
- `npm start` — serve production build

## Disclaimer

Products and copy are for a research-supply store demo. Replace branding, legal copy, and product assets with your own before going live. All items are positioned as laboratory research materials only.
