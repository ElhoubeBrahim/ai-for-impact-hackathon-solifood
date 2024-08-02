import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { LoadingComponent } from '../../shared/page/loading/loading.component';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from "../../shared/component/side-bar/side-bar.component";
import { NavBarComponent } from "../../shared/component/nav-bar/nav-bar.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [LoadingComponent, RouterOutlet, SideBarComponent, NavBarComponent, FooterComponent],
  templateUrl: './admin.component.html'
})
export class AdminComponent {

}
