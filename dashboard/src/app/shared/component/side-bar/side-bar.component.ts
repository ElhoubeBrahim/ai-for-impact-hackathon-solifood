import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

interface item {
  path: String
  icon: String
  value: String
  color: String
  type: Boolean
  num?: Number
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-bar.component.html'
})
export class SideBarComponent {
  @Input() logo: string = '/logo.svg'
  @Input() items: item[] = [
    {
      path: '/',
      icon: 'ri-dashboard-fill',
      value: 'Dashboard',
      color: 'green-600',
      type: false,
    },
    {
      path: '/user',
      icon: 'ri-user-2-fill',
      value: 'User',
      color: 'green-600',
      type: false,
    },
    {
      path: '/basket',
      icon: 'ri-shopping-basket-fill',
      value: 'Basket',
      color: 'green-600',
      type: false,
    }
    
  ]

}
