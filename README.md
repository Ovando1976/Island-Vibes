# Island-Vibes

Island-Vibes is a cannabis discovery, menu browsing, and reservation-request platform for the U.S. Virgin Islands (USVI).

This repository is being upgraded from an AI Studio starter into a production-oriented app with a clear frontend/backend split, typed domain models, and an implementation roadmap.

## Features (v1 target)

- Browse dispensaries by island and availability
- Browse products by category, effects, and featured status
- View dispensaries on a map
- Save favorites (products + dispensaries)
- Submit pickup or delivery reservation requests
- Manage account basics and order history
- Admin tools for inventory and order workflow
- AI-assisted discovery (recommendation + product comparison)

## Tech Stack

- **Frontend:** Vite, React 19, TypeScript, React Router, Tailwind
- **Data/Auth:** Firebase Auth + Firestore + Storage
- **Backend:** Express (for secret-bearing APIs and admin operations)
- **Maps:** Leaflet + React Leaflet
- **AI:** Gemini API via `@google/genai`

## Current/Target Project Structure

```text
Island-Vibes/
  src/
    app/
      router.tsx
      providers/
        AuthProvider.tsx
        QueryProvider.tsx
        ThemeProvider.tsx
    components/
      ui/
      layout/
      map/
      dispensary/
      product/
      forms/
    features/
      auth/
      dispensaries/
      products/
      favorites/
      cart/
      orders/
      reviews/
      ai/
      admin/
    pages/
      HomePage.tsx
      ExplorePage.tsx
      MapPage.tsx
      DispensaryPage.tsx
      ProductPage.tsx
      FavoritesPage.tsx
      CartPage.tsx
      AccountPage.tsx
      OrdersPage.tsx
      AdminDashboardPage.tsx
      AdminProductsPage.tsx
      AdminOrdersPage.tsx
    lib/
      firebase/
      api/
      utils/
      constants/
      validation/
    styles/
    types/
    main.tsx
  server/
    index.ts
    routes/
    services/
    middleware/
    types/
  scripts/
    seed.ts
  firestore.rules
  firestore.schema.md
  .env.example
  README.md
```

> Note: Some directories are currently placeholders (`.gitkeep`) to establish the agreed architecture and make milestone-based implementation easier.

## Route Plan

### Public routes

- `/`
- `/explore`
- `/map`
- `/dispensaries/:slug`
- `/products/:id`
- `/age-gate`
- `/login`
- `/signup`

### Authenticated routes

- `/account`
- `/favorites`
- `/cart`
- `/orders`
- `/orders/:id`

### Admin routes

- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/:id/edit`
- `/admin/orders`
- `/admin/dispensaries`
- `/admin/users`

## Environment Variables

Use separate env vars for client and server concerns.

### Client (`Vite`, exposed at build time)

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Server (secret-bearing)

```bash
PORT=4000
GEMINI_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Firebase project configured for Auth + Firestore

### Install

```bash
npm install
```

### Run frontend

```bash
npm run dev
```

### Validate TypeScript

```bash
npm run lint
```

## Firestore Data Model

The canonical schema is documented in [`firestore.schema.md`](./firestore.schema.md), including:

- Collection definitions
- TypeScript domain interfaces
- Recommended indexes
- Validation and operational notes

## API Plan

### Public API

- `GET /api/dispensaries`
- `GET /api/dispensaries/:slug`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/featured`
- `GET /api/search`

### Authenticated API

- `GET /api/me`
- `GET /api/favorites`
- `POST /api/favorites/toggle`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/reviews`

### Admin API

- `POST /api/admin/dispensaries`
- `PATCH /api/admin/dispensaries/:id`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `PATCH /api/admin/products/:id/stock`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/users`
- `POST /api/admin/seed`

### AI API

- `POST /api/ai/recommend`
- `POST /api/ai/product-compare`

## Milestones

1. **Foundation:** repo cleanup, structure, models, env validation
2. **Storefront:** explore + detail pages + filtering
3. **Map & discovery:** dispensary map, filters, location UX
4. **Auth & favorites:** signup/login, age gate, persistence
5. **Orders:** cart + pickup/delivery reservation flow
6. **Admin:** product/order operations and dashboard
7. **AI assistant:** recommendation and product compare UX

## Seed Data Plan

Implement `scripts/seed.ts` with:

- 3 dispensaries
- 24 products
- 6 featured products
- 8 reviews
- 1 `super_admin` test user

## Risks to Resolve Early

- Starter-template leftovers still dominate repo identity
- Role mismatch between Firestore rules and role model
- Hardcoded admin exceptions in security rules
- Firebase project configuration should be audited for production
- Frontend/server boundaries need explicit ownership

## Implementation Order (recommended)

1. Foundation cleanup
2. Data models
3. Storefront pages
4. Seed data
5. Auth
6. Favorites
7. Map
8. Orders
9. Admin
10. AI

## Roadmap Issues

See [`docs/issue-checklist.md`](./docs/issue-checklist.md) for a GitHub-ready epic and issue list.
