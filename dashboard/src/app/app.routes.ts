import { Routes } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UserComponent } from './features/user/user.component';
import { BasketComponent } from './features/basket/basket.component';
import { ReportComponent } from './features/report/report.component';
import { ProfilComponent } from './features/profil/profil.component';
import { BaseComponent } from './layout/base/base.component';
import { LoginComponent } from './features/login/login.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { OrderComponent } from './features/order/order.component';


export const routes: Routes = [
    {path: '', component:AdminComponent,
        ...canActivate(() => redirectUnauthorizedTo(['auth/login'])), 
        children:[
        {path:'',component:DashboardComponent},
        {path:'user',component:UserComponent},
        {path:'basket',component:BasketComponent},
        {path:'order',component:OrderComponent},
        {path:'report',component:ReportComponent},
        {path:'profil',component:ProfilComponent}
    ]},
    {path: 'auth', component: BaseComponent, children: [
        {path: 'login',
        ...canActivate(() => redirectLoggedInTo(['/'])),        
        component: LoginComponent},
    ]}
];
