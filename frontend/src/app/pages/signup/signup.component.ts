import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../components/input/input.component';
import { SigninWithGoogleComponent } from '../../components/signin-with-google/signin-with-google.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    SigninWithGoogleComponent,
    HeaderComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './signup.component.html',
})
export class SignUpComponent {
  constructor() {}

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
    console.log(this.user);
  }
}
