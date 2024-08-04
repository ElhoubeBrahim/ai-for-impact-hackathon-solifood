import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import dayjs from 'dayjs';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { ButtonComponent } from '../../shared/component/button/button.component';
import { ItemBasketComponent } from '../basket/item-basket/item-basket.component';
import { InputComponent } from '../../shared/component/input/input.component';
import { LoadingComponent } from '../../shared/page/loading/loading.component';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';
import { StorageService } from '../../core/service/storage.service';
import { BasketService } from '../../core/service/baske.service';
import { Basket } from '../../core/model/basket';
import { User } from '../../core/model/user';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    ButtonComponent,
    ItemBasketComponent,
    FormsModule,
    ButtonComponent,
    InputComponent,
    LoadingComponent,
    NoDataComponent,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './profil.component.html',
})
export class ProfilComponent implements OnInit, OnDestroy {
  public auth = inject(Auth);
  private router = inject(Router);
  public storage = inject(StorageService);
  private basket = inject(BasketService);

  basketsLoading = true;
  baskets: Basket[] = [];
  searchQuery = '';

  userSubscription: Subscription | undefined;
  currentUser: User | undefined;

  async ngOnInit() {
    this.userSubscription = this.storage.user$.subscribe(async (user) => {
      this.currentUser = user;
      if (user) {
        this.baskets = await this.basket.getBasketsByUser(user.id);
      }
      this.basketsLoading = false;
    });
  }

  searchBaskets() {
    console.log(this.searchQuery);
  }

  joinedAt(date: Timestamp): string {
    return dayjs(date.seconds * 1000).format('MMM YYYY');
  }

  navigateToSettings() {
    this.router.navigate(['/setting']);
  }

  navigateToBasketForm() {
    this.router.navigate(['/basket-form']);
  }
  navigateToDashboad() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
