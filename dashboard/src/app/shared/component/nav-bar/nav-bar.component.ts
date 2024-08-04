import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../core/model/user';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { StorageService } from '../../../core/service/storage.service';
import { AuthenticationService } from '../../../core/service/authentication.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit {
  public router = inject(Router);
  public storage = inject(StorageService);
  public authentication = inject(AuthenticationService);

  user: User | undefined;

  ngOnInit(): void {
    this.storage.user$.subscribe((user) => {
      this.user = user;
    });
  }

  handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
      this.authentication.signOut();
      this.router.navigate(['/auth/login']);
    }
  }
}
