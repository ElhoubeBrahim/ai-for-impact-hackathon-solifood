import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { SigninWithGoogleComponent } from 'src/app/components/signin-with-google/signin-with-google.component';
import { InputComponent } from 'src/app/components/input/input.component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,ButtonComponent,SigninWithGoogleComponent,InputComponent]
})
export class SignupPage  {

  private authentication = inject(AuthenticationService);
  private router = inject(Router);

  showPassword = false;
  buttonsDisabled = false;

  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  async handleSubmit() {
    this.buttonsDisabled = true;

    // Sign up
    const result = await this.authentication.signUp(this.user);
    if (result.error || !result.user) {
      switch (result.error.code) {
        case 'auth/email-already-in-use':
          console.log('Oops! This email is already in use');
          break;
        default:
          console.log('Oops! Something went wrong');
          break;
      }
      this.buttonsDisabled = false;
      return;
    }

    // Redirect to explore page
    console.log(
      'Your account has been created successfully. Please login to continue',
    );
    this.router.navigate(['/login']);
  }



}
