import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ButtonComponent } from '../../components/button/button.component';
import { StorageService } from '../../core/services/storage.service';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, UserAvatarComponent, ButtonComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public storage = inject(StorageService);
  public authentication = inject(AuthenticationService);
  public router = inject(Router);
  links = [
    { label: 'Explore', path: '/explore' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  constructor() {}

  handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
      this.authentication.signOut();
      this.router.navigate(['/login']);
    }
  }
  navigateToBasketForm(){
    this.router.navigate(["/basket-form"]);
  }
}
