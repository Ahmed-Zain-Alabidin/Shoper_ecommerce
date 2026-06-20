# Shoper — Angular Frontend

Angular 19 migration of the Next.js `frontend/` app. The original Next.js app remains untouched in `../frontend/`.

## Requirements

- Node.js 18+
- Backend running at `http://localhost:4500`

## Installation

```bash
cd frontend-angular
npm install
```

## Development

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200). The root route shows a **Shared Components Preview** (Navbar, Hero, Footer, CategoryCard, ProductCard).

## Build

```bash
npm run build
```

Output: `dist/frontend-angular/`

## Project structure

```
src/app/
├── core/
│   ├── guards/          # auth, admin, seller
│   ├── interceptors/    # 401 handling
│   ├── models/          # TypeScript interfaces
│   └── services/        # Auth, Cart, Wishlist, Product, Category, Review
├── shared/
│   ├── components/      # Migrated UI components (Step 2)
│   └── utils/
└── features/            # Page modules (Step 4+)
```

## Environment

| File                                   | Purpose            |
| -------------------------------------- | ------------------ |
| `src/environments/environment.ts`      | Dev API URL        |
| `src/environments/environment.prod.ts` | Production API URL |

Default API URL: `http://localhost:4500`

## Package mapping (Next.js → Angular)

| Next.js        | Angular                                                   |
| -------------- | --------------------------------------------------------- |
| `zustand`      | `AuthService`, `CartService`, `WishlistService` (signals) |
| `axios`        | `@angular/common/http` + `authInterceptor`                |
| `lucide-react` | `@lucide/angular`                                         |
| `next/link`    | `RouterLink`                                              |
| Tailwind CSS 4 | Same — `src/styles.css` + PostCSS                         |

## Migration status

- [x] Phase 0 — Project scaffold + core layer
- [x] Step 2 — Shared components
- [ ] Step 3 — Layouts
- [ ] Step 4 — Pages (one by one)
