import { Component, inject, Input, OnInit } from '@angular/core';
import { Basket } from '../../core/model/basket';
import { ItemBasketComponent } from './item-basket/item-basket.component';
import { LoadingComponent } from '../../shared/page/loading/loading.component';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';
import { HttpService } from '../../core/service/http.service';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [ItemBasketComponent,LoadingComponent,NoDataComponent],
  templateUrl: './basket.component.html'
})
export class BasketComponent implements OnInit{
  @Input() isSearchMode = false;
  http = inject(HttpService)
  baskets: Basket[] = [];
  endReached = false;
  basketsLoading = false;
  loading = true;

  ngOnInit(): void {
    this.http.get<Basket[]>('baskets').subscribe((accounts) => {
      this.baskets = accounts;
      this.loading = false;
    })
  }
}
