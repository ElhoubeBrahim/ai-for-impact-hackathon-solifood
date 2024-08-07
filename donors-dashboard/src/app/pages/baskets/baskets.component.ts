import { Component, inject, Input, OnInit } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Basket } from '../../core/model/basket';
import { HttpService } from '../../core/services/http.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';
import { ItemBasketComponent } from './item-basket/item-basket.component';
import { AuthenticationService } from '../../core/services/authentication.service';
import { BasketService } from '../../core/services/basket.service';
import { User } from '../../core/model/user';
import { ButtonComponent } from '../../shared/component/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    ItemBasketComponent,
    LoadingComponent,
    NoDataComponent,
    InfiniteScrollDirective,
    ButtonComponent,
    RouterLink,
  ],
  templateUrl: './baskets.component.html',
})
export class BasketsComponent implements OnInit {
  @Input() isSearchMode = false;
  http = inject(HttpService);
  authentication = inject(AuthenticationService);
  basketService = inject(BasketService);

  currentUser: User | null = null;

  baskets: Basket[] = [];
  endReached = false;
  basketsLoading = false;
  loading = true;

  async ngOnInit() {
    const currUser = await this.authentication.getCurrentUser();
    this.currentUser = currUser.user;

    this.getBaskets();
  }

  async getBaskets() {
    if (!this.currentUser) {
      console.error('User not found');
      this.loading = false;
      return;
    }

    this.basketService
      .getBasketsByUser(this.currentUser.id)
      .subscribe((baskets) => {
        this.baskets = baskets;
        this.loading = false;
      });
  }

  async handleScroll() {
    if (this.basketsLoading || this.endReached || !this.currentUser) return;
    this.basketsLoading = true;

    const lastResult = this.baskets[this.baskets.length - 1];
    this.basketService
      .getBasketsByUser(this.currentUser.id, lastResult)
      .subscribe((baskets) => {
        if (baskets.length === 0) {
          this.endReached = true;
        } else {
          this.baskets.push(...baskets);
        }
        this.basketsLoading = false;
      });
  }

  deleteBasket(id: string) {
    this.baskets = this.baskets.filter((basket) => basket.id !== id);
  }
}
