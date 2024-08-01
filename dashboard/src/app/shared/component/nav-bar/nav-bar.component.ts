import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent {
  ngOnInit(): void {
    initFlowbite()
  }
  notifications: any = [
    {
      img: '/assets/images.png',
      type: 'reject',
      from: 'Ahmed bouzine',
      email: 'elghazouani.hamza1@gmail.com',
      content: "Hey, what's up? All set for the presentation?",
      time: 'a few moments',
    }
  ]

  user: any = {
    img: '/user.svg',
    username: 'Hamza el ghazouani',
    email: 'elghazouani.hamza1@gmail.com',
  }
}
