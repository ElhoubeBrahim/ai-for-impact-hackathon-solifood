import { Component,  inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { User } from '../../../core/model/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonComponent, AsyncPipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public router = inject(Router);
  links = [
    { label: 'Explore', path: '/explore' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  userSubscription: Subscription | undefined;
  currentUser: User | undefined;

  constructor() {}

  handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
      this.router.navigate(['/login']);
    }
  }
  navigateToProfile() {
    this.router.navigate(['/profil']);
  }
  navigateToBasketForm() {
    this.router.navigate(['/basket-form']);
  }
}
