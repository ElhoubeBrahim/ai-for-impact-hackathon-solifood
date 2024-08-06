import { Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { AdminComponent } from './layout/admin/admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BasketsComponent } from './pages/baskets/baskets.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { LoginComponent } from './pages/login/login.component';
import { BasketComponent } from './pages/basket/basket.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'baskets', component: BasketsComponent },
      { path: 'baskets/:id', component: BasketComponent },
      { path: 'orders', component: OrdersComponent },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(() => redirectLoggedInTo(['/dashboard'])),
  },
];
