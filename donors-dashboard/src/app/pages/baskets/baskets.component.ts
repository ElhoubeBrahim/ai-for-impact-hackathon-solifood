import { Component, inject, Input, OnInit } from '@angular/core';
import { Basket } from '../../core/model/basket';
import { HttpService } from '../../core/services/http.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';
import { ItemBasketComponent } from './item-basket/item-basket.component';
import { AuthenticationService } from '../../core/services/authentication.service';
import { BasketService } from '../../core/services/basket.service';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [ItemBasketComponent, LoadingComponent, NoDataComponent],
  templateUrl: './baskets.component.html',
})
export class BasketsComponent implements OnInit {
  @Input() isSearchMode = false;
  http = inject(HttpService);
  authentication = inject(AuthenticationService);
  basketService = inject(BasketService);

  baskets: Basket[] = [];
  endReached = false;
  basketsLoading = false;
  loading = true;

  ngOnInit(): void {
    this.getBaskets();
  }

  async getBaskets() {
    const currentUser = await this.authentication.getCurrentUser();
    if (!currentUser.user) {
      console.error('User not found:', currentUser.error);
      this.loading = false;
      return;
    }

    this.basketService
      .getBasketsByUser(currentUser.user.id)
      .subscribe((baskets) => {
        this.baskets = baskets;
        this.loading = false;
      });
  }
}
