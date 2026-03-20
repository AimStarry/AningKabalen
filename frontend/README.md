# 🌾 AningKabalen — Angular Frontend

Farm-to-Buyer Marketplace built with Angular 17 (standalone components).

## Quick Start

```bash
npm install
ng serve
# Opens at http://localhost:4200
```

## Backend Required
Make sure the backend is running at `http://localhost:5000`  
See `aningkabalen-backend/README.md` for setup.

## Project Structure

```
src/app/
├── core/
│   ├── services/        ← AuthService, ListingService, CartService, etc.
│   ├── guards/          ← authGuard, farmerGuard, adminGuard
│   └── interceptors/    ← authInterceptor (attaches JWT to all requests)
├── shared/
│   └── components/
│       ├── navbar/      ← Public navbar (auth-aware, cart badge)
│       ├── footer/      ← Footer
│       ├── sidebar/     ← Admin sidebar
│       └── farmer-navbar/ ← Farmer pill navbar
├── home/                ← Landing page (live listings from API)
├── products/            ← Product browse (search, filter by category/farm)
├── crop-detail/         ← Single product page (reviews, add to cart)
├── farmer-profile/      ← Farmer page (their listings, grid + sidebar)
├── cart/                ← Cart (CartService, localStorage-persisted)
├── checkout/            ← Checkout (cart → order)
├── reservation/         ← Reserve crops (API farmers + listings)
├── login/               ← Login + Register (JWT auth)
├── buyer-profile/       ← My orders + reservations
├── order-detail/        ← Single order details
├── about/ contact/ view-all/
├── farmer-dashboard/    ← Farmer home (stats + tables from API)
├── create-listing/      ← Farmer CRUD listings (image upload)
├── my-listing/          ← Farmer listing view
├── transactions-farmer/ ← Farmer transactions (expandable rows)
└── admin-dashboard/     ← Admin (inline status editing for all tables)
```

## Auth Flow
1. User registers/logs in → JWT stored in `localStorage`
2. `authInterceptor` attaches `Authorization: Bearer <token>` to every request
3. `authGuard` / `farmerGuard` / `adminGuard` protect routes

## Environment
- Dev:  `src/environments/environment.ts`     → `http://localhost:5000/api`
- Prod: `src/environments/environment.prod.ts` → update with your production URL
