import { Routes } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    {path: '', component:AdminComponent, children:[
        {path:'',component:DashboardComponent},
    ]}
];
