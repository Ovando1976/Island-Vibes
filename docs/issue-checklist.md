# GitHub Issue Checklist (Roadmap)

Use this as the initial issue backlog grouped by epics. Each issue includes a suggested title and definition of done.

## Epic 1: Foundation

### 1. Replace default README with product-focused documentation
- [ ] README includes product overview, setup, env vars, architecture, roadmap
- [ ] README links to schema + issue docs

### 2. Rename package and app metadata to `island-vibes`
- [ ] `package.json` name is `island-vibes`
- [ ] lockfile metadata updated
- [ ] any UI branding/title references updated

### 3. Split client/server structure and establish folder ownership
- [ ] `src/` and `server/` boundaries documented
- [ ] foundational folders exist for feature modules and API services

### 4. Add shared TypeScript domain models
- [ ] user/dispensary/product/order/review types added
- [ ] enums use v1 role/category/status values

### 5. Add Firebase client initialization module
- [ ] single source of truth for Firebase app/auth/firestore/storage
- [ ] guards against missing env vars

### 6. Add Express server bootstrap
- [ ] `server/index.ts` starts app and healthcheck route
- [ ] API router mounted under `/api`

### 7. Add environment validation for client/server configs
- [ ] startup fails fast on missing required env vars
- [ ] validation messages are actionable

## Epic 2: Customer Storefront

### 1. Build Home page
- [ ] hero + featured sections
- [ ] links to explore/map pages

### 2. Build Explore page
- [ ] product + dispensary listing UX
- [ ] loading + empty states

### 3. Build Product detail page
- [ ] product metadata rendered
- [ ] add-to-cart / favorite actions stubbed or wired

### 4. Build Dispensary detail page
- [ ] dispensary profile + menu sections
- [ ] map/address block shown when available

### 5. Add filtering and sorting (island/category/price/effects)
- [ ] URL-driven filter state
- [ ] reset/clear filters option

### 6. Add empty/loading/error states
- [ ] skeletons/spinners where appropriate
- [ ] user-friendly error messages

## Epic 3: Account System

- [ ] Implement Firebase Auth integration
- [ ] Build login/signup pages
- [ ] Add age-gate flow
- [ ] Build account page
- [ ] Add favorites persistence

## Epic 4: Ordering

- [ ] Build cart state + cart page
- [ ] Build order submission endpoint
- [ ] Build order history page
- [ ] Add order status UI and timeline

## Epic 5: Admin

- [ ] Build admin dashboard
- [ ] Add product CRUD
- [ ] Add order management
- [ ] Add inventory/stock updates

## Epic 6: AI

- [ ] Add recommendation endpoint
- [ ] Add conversational product finder
- [ ] Add product comparison workflow

## Milestone sequencing (recommended)

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
