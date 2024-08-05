import { Component, Input, inject } from '@angular/core';
// import { AuthenticationService } from '../../core/services/authentication.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-signin-with-google',
  standalone: true,
  imports: [],
  templateUrl: './signin-with-google.component.html',
})
export class SigninWithGoogleComponent {
  private authentication = inject(AuthenticationService);
  private router = inject(Router);
  // private toastr = inject(ToastrService);
  @Input() disabled = false;

  async handleGoogleSignIn() {
    this.disabled = true;
    const result = await this.authentication.signInWithGoogle();
    if (result.error || !result.user) {
      console.log('Oops! Something went wrong. Please try again.');
      this.disabled = false;
      return;
    }

    // Redirect to explore page
    this.router.navigate(['/explore']);
  }
}
