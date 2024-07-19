import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { SigninWithGoogleComponent } from '../../components/signin-with-google/signin-with-google.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    HeaderComponent,
    ButtonComponent,
    InputComponent,
    SigninWithGoogleComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor() {}

  showPassword = false;
  buttonsDisabled = false;
  user = {
    email: '',
    password: '',
  };

  async handleSubmit() {
    this.buttonsDisabled = true;
    console.log(this.user);
  }
}
