import { Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';


export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    ...canActivate(() => redirectLoggedInTo(['/explore'])),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage),
    ...canActivate(() => redirectLoggedInTo(['/explore'])),
  },
  {
    path: 'explore',
    loadComponent: () => import('./pages/explore/explore.page').then( m => m.ExplorePage),
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
   {
    path: 'basket/:id',
    loadComponent: () => import('./pages/view-basket/view-basket.page').then( m => m.ViewBasketPage),
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),

  },
];
