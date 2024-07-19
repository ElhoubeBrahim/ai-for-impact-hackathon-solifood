import { Component, Input, inject } from '@angular/core';

@Component({
  selector: 'app-signin-with-google',
  standalone: true,
  imports: [],
  templateUrl: './signin-with-google.component.html',
})
export class SigninWithGoogleComponent {
  constructor() {}
  @Input() disabled = false;

  async handleGoogleSignIn() {
    console.log('handleGoogleSignIn');
  }
}
