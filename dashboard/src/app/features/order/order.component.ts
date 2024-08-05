import { Component, inject, Input, OnInit } from '@angular/core';
import { ItemBasketComponent } from '../basket/item-basket/item-basket.component';
import { LoadingComponent } from '../../shared/page/loading/loading.component';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';
import { HttpService } from '../../core/service/http.service';
import { Basket } from '../../core/model/basket';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ItemBasketComponent, LoadingComponent, NoDataComponent],
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit{
  @Input() isSearchMode = false;
  http = inject(HttpService)
  order: Basket[] = [];
  endReached = false;
  basketsLoading = false;
  loading = false;

  ngOnInit(): void {
    this.http.get<Basket[]>('orders').subscribe((order) => {
      this.order = order;
    })
  }
}
