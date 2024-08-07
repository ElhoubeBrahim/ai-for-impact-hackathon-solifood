import { Component, inject, Input, OnInit } from '@angular/core';
import { ItemBasketComponent } from '../basket/item-basket/item-basket.component';
import { LoadingComponent } from '../../shared/page/loading/loading.component';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';
import { HttpService } from '../../core/service/http.service';
import { Order } from '../../core/model/order';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ItemBasketComponent, LoadingComponent, NoDataComponent, CommonModule],
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit{
  @Input() isSearchMode = false;
  http = inject(HttpService)
  order: Order[] = [];
  endReached = false;
  basketsLoading = false;
  loading = false;

  ngOnInit(): void {
    this.http.get<Order[]>('orders').subscribe((order) => {
      console.log('order',order[0]);
      this.order = order;
    })
  }

  constructor(public dialog: MatDialog) {}

  openDialog(data: Order) {
    this.dialog.open(OrderDetailComponent, {
      data: data,
    });
  }
}
