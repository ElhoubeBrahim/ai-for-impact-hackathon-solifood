import { Component, inject } from '@angular/core';
import { InputComponent } from '../../shared/component/input/input.component';
import { HeaderComponent } from '../../shared/component/header/header.component';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/component/button/button.component';
import { AuthenticationService } from '../../core/service/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    HeaderComponent,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private authentication = inject(AuthenticationService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  showPassword = false;
  buttonsDisabled = false;
  user = {email: '', password: ''};
  handleSubmit(){
    this.buttonsDisabled = true;

    // TODO: Add form validation
    this.authentication.signIn(this.user.email,this.user.password).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        switch (error) {
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
    });

  }
}
