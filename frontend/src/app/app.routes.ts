import { Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { HomeComponent } from './pages/home/home.component';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { BasketComponent } from './pages/basket/basket.component';
import { BasketFormComponent } from './pages/basket-form/basket-form.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { OrderComponent } from './pages/order/order.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
    children: [
      {
        path: 'explore',
        component: ExploreComponent,
      },
      {
        path: "explore/:id",
        component: BasketComponent,
      },
      {
        path: "basket-form",
        component: BasketFormComponent,
      },
      {
        path: "order/:id",
        component: OrderComponent,
      },
      {
        path: "profil",
        component: ProfilComponent,
      },
    ],
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(() => redirectLoggedInTo(['/explore'])),
  },
  {
    path: 'signup',
    component: SignUpComponent,
    ...canActivate(() => redirectLoggedInTo(['/explore'])),
  },
];
