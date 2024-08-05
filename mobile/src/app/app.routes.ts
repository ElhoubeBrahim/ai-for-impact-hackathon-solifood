import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'explore',
    loadComponent: () => import('./pages/explore/explore.page').then( m => m.ExplorePage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },
  {
    path: 'basket',
    loadComponent: () => import('./pages/basket/basket.page').then( m => m.BasketPage)
  },
   {
    path: 'basket/:id',
    loadComponent: () => import('./pages/view-basket/view-basket.page').then( m => m.ViewBasketPage)

  },
];
