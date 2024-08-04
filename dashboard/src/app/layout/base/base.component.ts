import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/component/header/header.component';
import { LoadingComponent } from '../../shared/page/loading/loading.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet,FooterComponent,LoadingComponent],
  templateUrl: './base.component.html'
})
export class BaseComponent {

}
