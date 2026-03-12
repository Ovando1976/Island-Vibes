# Folder Skeleton

This document maps the intended project layout and ownership boundaries.

```text
src/
  app/                 # app-level wiring: router/providers
  components/          # reusable UI primitives and shared components
  features/            # domain-specific feature modules
  pages/               # route-level page components
  lib/                 # platform plumbing (firebase/api/utils/constants/validation)
  styles/              # global and shared styles
  types/               # shared type declarations

server/
  routes/              # API route handlers
  services/            # business/services (firebase-admin, orders, ai)
  middleware/          # auth/roles/errors middleware
  types/               # server-only types

scripts/               # utilities like seed/migrations
```

## Conventions

- Keep browser-safe code in `src/`.
- Keep secret-bearing code (admin SDK keys, AI server calls) in `server/`.
- Each feature should own:
  - `api.ts`
  - `hooks.ts`
  - `types.ts`
  - optional local `components/`
- Prefer domain types in feature modules and shared cross-domain types in `src/types/`.
