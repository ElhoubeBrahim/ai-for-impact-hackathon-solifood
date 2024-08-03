import { Routes } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BasketsComponent } from './pages/baskets/baskets.component';
import { OrdersComponent } from './pages/orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'baskets', component: BasketsComponent },
      { path: 'orders', component: OrdersComponent },
    ],
  },
];
