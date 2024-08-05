import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonText, IonButton } from '@ionic/angular/standalone';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { InputComponent } from 'src/app/components/input/input.component';
import { SigninWithGoogleComponent } from 'src/app/components/signin-with-google/signin-with-google.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonText, IonButton, IonItem, CommonModule, FormsModule, ButtonComponent,InputComponent,SigninWithGoogleComponent]
})
export class LoginPage {
  private authentication = inject(AuthenticationService);
  private router = inject(Router);

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
          console.log('Oops! The email or password is incorrect');
          break;
        default:
          console.log('Oops! Something went wrong');
          break;
      }

      this.buttonsDisabled = false;
      return;
    }

    // Redirect to explore page
    this.router.navigate(['/explore']);
  }
}
