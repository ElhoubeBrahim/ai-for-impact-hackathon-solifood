import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { FooterComponent } from './components/footer/footer.component';
import { Auth } from '@angular/fire/auth';
import { StorageService } from './core/services/storage.service';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoadingComponent],
  templateUrl: './app.component.html',
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
        this.storage.user = result.user || undefined;
        return;
      }

      this.storage.user = undefined;
    });

    // Scroll to top on route change
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
