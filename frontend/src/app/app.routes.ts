import { Routes } from '@angular/router';
import { authGuard, farmerGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ── Public ─────────────────────────────────────────────────
  { path: 'home',     loadComponent: () => import('./home/home').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./products/products').then(m => m.ProductsComponent) },
  { path: 'products/:category', loadComponent: () => import('./products/products').then(m => m.ProductsComponent) },
  { path: 'farm/:id', loadComponent: () => import('./farmer-profile/farmer-profile').then(m => m.FarmerProfileComponent) },
  { path: 'crop/:id', loadComponent: () => import('./crop-detail/crop-detail').then(m => m.CropDetailComponent) },
  { path: 'about',    loadComponent: () => import('./about/about').then(m => m.AboutComponent) },
  { path: 'contact',  loadComponent: () => import('./contact/contact').then(m => m.ContactComponent) },
  { path: 'view-all', loadComponent: () => import('./view-all/view-all').then(m => m.ViewAllComponent) },
  { path: 'login',    loadComponent: () => import('./login/login').then(m => m.LoginComponent) },

  // ── Buyer (auth required) ───────────────────────────────────
  { path: 'cart',       canActivate: [authGuard], loadComponent: () => import('./cart/cart').then(m => m.CartComponent) },
  { path: 'checkout',   canActivate: [authGuard], loadComponent: () => import('./checkout/checkout').then(m => m.CheckoutComponent) },
  { path: 'reservation',canActivate: [authGuard], loadComponent: () => import('./reservation/reservation').then(m => m.ReservationComponent) },
  { path: 'order/:id',  canActivate: [authGuard], loadComponent: () => import('./order-detail/order-detail').then(m => m.OrderDetailComponent) },
  { path: 'profile',    canActivate: [authGuard], loadComponent: () => import('./buyer-profile/buyer-profile').then(m => m.BuyerProfileComponent) },

  // ── Farmer ─────────────────────────────────────────────────
  { path: 'farmer',              canActivate: [authGuard, farmerGuard], loadComponent: () => import('./farmer-dashboard/farmer-dashboard').then(m => m.FarmerDashboardComponent) },
  { path: 'farmer/listings',     canActivate: [authGuard, farmerGuard], loadComponent: () => import('./create-listing/create-listing').then(m => m.CreateListingComponent) },
  { path: 'farmer/my-listing',   canActivate: [authGuard, farmerGuard], loadComponent: () => import('./my-listing/my-listing').then(m => m.MyListingComponent) },
  { path: 'farmer/transactions', canActivate: [authGuard, farmerGuard], loadComponent: () => import('./transactions-farmer/transactions-farmer').then(m => m.TransactionsFarmerComponent) },

  // ── Admin ───────────────────────────────────────────────────
  { path: 'admin', canActivate: [authGuard, adminGuard], loadComponent: () => import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) },

  { path: '**', redirectTo: 'home' }
];
