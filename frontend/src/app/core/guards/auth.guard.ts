import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  // Save the attempted URL so we can redirect after login
  router.navigate(['/login'], { queryParams: { returnUrl: route.url.toString() } });
  return false;
};

export const farmerGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const user   = auth.currentUser();
  if (user?.role === 'farmer') return true;
  router.navigate(['/home']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const user   = auth.currentUser();
  if (user?.role === 'admin') return true;
  router.navigate(['/home']);
  return false;
};
