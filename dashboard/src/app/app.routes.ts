import { Routes } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UserComponent } from './features/user/user.component';
import { BasketComponent } from './features/basket/basket.component';


export const routes: Routes = [
    {path: '', component:AdminComponent, children:[
        {path:'',component:DashboardComponent},
        {path:'user',component:UserComponent},
        {path:'basket',component:BasketComponent}
    ]}
];
