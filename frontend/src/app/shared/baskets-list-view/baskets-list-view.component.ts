import { Component, inject, Input, OnInit } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Basket } from '../../core/models/basket';
import { lastValueFrom } from 'rxjs';
import { BasketService } from '../../core/services/basket.service';
import { BasketComponent } from '../basket/basket.component';
import { NoDataComponent } from '../../components/no-data/no-data.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-baskets-list-view',
  standalone: true,
  imports: [
    InfiniteScrollModule,
    BasketComponent,
    NoDataComponent,
    LoadingComponent,
  ],
  templateUrl: './baskets-list-view.component.html',
})
export class BasketsListViewComponent implements OnInit {
  @Input() isSearchMode = false;

  private basket = inject(BasketService);

  baskets: Basket[] = [];
  endReached = false;
  basketsLoading = false;
  loading = false;

  async ngOnInit() {
    this.loading = true;
    await this.loadBaskets();
    this.loading = false;
  }

  async loadBaskets() {
    // Get last result to start after
    this.endReached = false;
    const lastResult =
      this.baskets.length > 0 ? this.baskets[this.baskets.length - 1] : null;

    const data = await lastValueFrom(this.basket.getBaskets(lastResult));
    this.baskets = [...this.baskets, ...data];

    // If no baskets, end reached
    this.endReached = data.length === 0;
  }

  async handleScroll() {
    if (this.basketsLoading || this.endReached || this.isSearchMode) return;
    this.basketsLoading = true;
    await this.loadBaskets();
    this.basketsLoading = false;
  }

  async searchBaskets(query: string) {
    if (!query) return;
    this.endReached = false;
    this.loading = true;

    // Reset baskets
    this.baskets = [];

    // Get baskets ID from the search API
    this.baskets = await lastValueFrom(this.basket.searchBaskets(query));
    this.endReached = true;
    this.isSearchMode = true;
    this.loading = false;
  }
}
