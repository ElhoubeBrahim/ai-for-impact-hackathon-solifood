import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { SigninWithGoogleComponent } from "../../shared/component/signin-with-google/signin-with-google.component";
import { ButtonComponent } from '../../shared/component/button/button.component';
import { InputComponent } from '../../shared/component/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    SigninWithGoogleComponent,
    ButtonComponent,
    InputComponent,
],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authentication = inject(AuthenticationService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  constructor() {}

  showPassword = false;
  buttonsDisabled = false;
  user = {
    email: '',
    password: '',
  };

  async handleSubmit() {
    this.buttonsDisabled = true;

    // TODO: Add form validation

    // Sign in user
    const result = await this.authentication.signIn(
      this.user.email,
      this.user.password,
    );
    if (result.error) {
      switch (result.error.code) {
        case 'auth/user-not-found' || 'auth/wrong-password':
          this.toastr.error('Oops! The email or password is incorrect');
          break;
        default:
          this.toastr.error('Oops! Something went wrong');
          break;
      }

      this.buttonsDisabled = false;
      return;
    }

    // Redirect to dashboard page
    this.router.navigate(['/dashboard']);
  }
}
