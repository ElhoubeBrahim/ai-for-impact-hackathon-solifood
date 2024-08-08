import { Component, inject, Input, OnInit } from '@angular/core';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemBasketComponent } from '../baskets/item-basket/item-basket.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { HttpService } from '../../core/services/http.service';
import { Order } from '../../core/model/order';
import { RouterLink } from '@angular/router';
import dayjs from 'dayjs';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    ItemBasketComponent,
    LoadingComponent,
    NoDataComponent,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  @Input() isSearchMode = false;
  http = inject(HttpService);
  orders: Order[] = [];
  endReached = false;
  basketsLoading = false;
  loading = false;

  ngOnInit(): void {
    this.http.get<Order[]>('orders').subscribe((orders) => {
      this.orders = orders;
    });
  }

  constructor(public dialog: MatDialog) {}

  openDialog(data: Order) {
    this.dialog.open(OrderDetailComponent, {
      data: data,
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }

  formatDate(date: Date): string {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  }
}
