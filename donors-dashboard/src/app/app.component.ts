import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { StorageService } from './core/services/storage.service';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(Auth);
  private storage = inject(StorageService);
  private authentication = inject(AuthenticationService);

  ngOnInit() {
    // Load user data
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        const result = await this.authentication.getCurrentUser();
        this.storage.setUser(result.user || undefined);

        // If user is null, sign out
        if (!result.user) {
          this.authentication.signOut();
          this.router.navigate(['/login']);
        }

        return;
      }

      this.storage.setUser(undefined);
    });

    // Scroll to top on route change
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
