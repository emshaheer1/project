# Apollo Peptide Store

Full research-peptide e-commerce store modeled on Apollo Peptide Sciences flows: catalog, auth, cart/checkout, wishlist, compare, and account pages.

| Layer | Stack | Host |
|-------|--------|------|
| Frontend | Next.js (App Router) + Tailwind | [Vercel](https://vercel.com) |
| Backend | Express + Prisma + TypeScript | [Render](https://render.com) |
| Database | SQLite (local) / PostgreSQL (Render) | Render Postgres |

```
Apollo/
  frontend/   → deploy to Vercel
  backend/    → deploy to Render
```

## Local development

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
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
| `DATABASE_URL` | Yes | Render Postgres connection string |
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

Without Stripe keys, checkout creates a **demo paid** order and redirects to the success page.

## Deploy: Render (backend + Postgres)

1. Push this repo to GitHub.
2. In Render, create a **PostgreSQL** database (or use Blueprint with `render.yaml`).
3. **Switch Prisma to PostgreSQL** before deploy:
   - Copy `backend/prisma/schema.postgres.prisma` over `backend/prisma/schema.prisma`
     (or change `provider = "sqlite"` to `provider = "postgresql"`).
   - Local development can keep SQLite (`DATABASE_URL="file:./dev.db"`).
4. Create a **Web Service** from `backend/`:
   - **Build:** `npm install && npx prisma generate && npm run build`
   - **Start:** `npx prisma db push && npm run seed && npm start`
5. Set env vars: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`.
6. Note the service URL (e.g. `https://apollo-api.onrender.com`).

Optional: use the root `render.yaml` Blueprint (set `FRONTEND_URL` after creating the Vercel app).

## Deploy: Vercel (frontend)

1. Import the repo in Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework: Next.js (auto-detected).
4. Env: `NEXT_PUBLIC_API_URL=https://YOUR-RENDER-API.onrender.com`
5. Deploy.

Update Render `FRONTEND_URL` to your Vercel domain so CORS allows the storefront.

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

Open `http://localhost:3000/dashboard/login`

There are **no default admin credentials** in the app. Set strong values in `backend/.env` before seeding:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` (12+ chars, upper, lower, number, special character)
- `JWT_SECRET` (32+ random characters)

Then run `npm run seed` in `/backend`. To rotate the admin password later, set `SEED_RESET_ADMIN_PASSWORD=true` and re-seed.

Dashboard sections:

- Overview stats
- Users → Registered Users / Details of Users
- Orders (full table + expandable details)
- Contact Us requests


1. Add `STRIPE_SECRET_KEY` on Render.
2. Point webhook to `https://YOUR-API/api/orders/stripe-webhook` for `checkout.session.completed`.
3. Set `STRIPE_WEBHOOK_SECRET`.

Checkout will then redirect to Stripe Checkout instead of demo mode.

## Scripts

**Backend**

- `npm run dev` — watch mode
- `npm run build` — compile TypeScript
- `npm start` — run compiled server
- `npm run seed` — seed ~29 catalog products

**Frontend**

- `npm run dev` — Next.js dev server
- `npm run build` — production build
- `npm start` — serve production build

## Disclaimer

Products and copy are for a research-supply store demo. Replace branding, legal copy, and product assets with your own before going live. All items are positioned as laboratory research materials only.
