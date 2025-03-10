import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';

// Auth guard function (Angular 19 style)
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl('/login');
};

export const routes: Routes = [
  // Default redirect to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Auth module
  { path: 'login', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
  
  // Protected routes (with lazy loading)
  { 
    path: 'dashboard', 
    canActivate: [() => authGuard()],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) 
  },
  { 
    path: 'list', 
    canActivate: [() => authGuard()],
    loadChildren: () => import('./features/list/list.routes').then(m => m.LIST_ROUTES) 
  },
  
  // Fallback route (404)
  { path: '**', redirectTo: '/login' }
];
