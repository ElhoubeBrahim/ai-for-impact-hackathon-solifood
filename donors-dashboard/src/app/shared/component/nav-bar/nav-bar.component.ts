import { Component, inject } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { User } from '../../../core/model/user';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent {
  public router = inject(Router);
  public storage = inject(StorageService);
  public authentication = inject(AuthenticationService);

  user: User | undefined;
  showMenu = false;

  async handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
      await this.authentication.signOut();
      this.router.navigate(['/login']);
    }
  }
}
