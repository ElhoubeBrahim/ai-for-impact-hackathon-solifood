import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import dayjs from 'dayjs';
import { ButtonComponent } from '../../components/button/button.component';
import { FormsModule } from '@angular/forms';
import { ChoiceComponent } from '../../components/choice/choice.component';
import { InputComponent } from '../../components/input/input.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { NoDataComponent } from '../../components/no-data/no-data.component';
import { TagsInputComponent } from '../../components/tags-input/tags-input.component';
import { BasketComponent } from '../../shared/basket/basket.component';
import { Router, RouterLink } from '@angular/router';
import { Basket } from '../../core/models/basket';
import { Auth } from '@angular/fire/auth';
import { StorageService } from '../../core/services/storage.service';
import { BasketService } from '../../core/services/basket.service';
import { Subscription } from 'rxjs';
import { User } from '../../core/models/user';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    ButtonComponent,
    BasketComponent,
    FormsModule,
    ButtonComponent,
    InputComponent,
    TagsInputComponent,
    ChoiceComponent,
    LoadingComponent,
    NoDataComponent,
    RouterLink,
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
