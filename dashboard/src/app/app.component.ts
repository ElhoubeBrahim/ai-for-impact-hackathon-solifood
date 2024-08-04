import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { StorageService } from './core/service/storage.service';
import { AuthenticationService } from './core/service/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(Auth);
  private storage = inject(StorageService);
  private authentication = inject(AuthenticationService);

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.authentication.getCurrentUser().subscribe((result) => {
          this.storage.setUser(result.user || undefined);
          if (!result.user) {
            this.authentication.signOut();
            this.router.navigate(['/auth/login']);
          }
        });
      }

      this.storage.setUser(undefined);
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
