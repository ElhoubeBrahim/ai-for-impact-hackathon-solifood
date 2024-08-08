import { Component, inject, Input, OnInit } from '@angular/core';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { HttpService } from '../../core/services/http.service';
import { Order, OrderStatus } from '../../core/model/order';
import { RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import { OrderService } from '../../core/services/order.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    LoadingComponent,
    NoDataComponent,
    CommonModule,
    RouterLink,
    InfiniteScrollDirective,
  ],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  http = inject(HttpService);
  orderService = inject(OrderService);
  toastr = inject(ToastrService);

  orders: Order[] = [];
  endReached = false;
  ordersLoading = false;
  loading = true;
  statuses = OrderStatus;

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
      this.loading = false;
    });
  }

  constructor(public dialog: MatDialog) {}

  async handleScroll() {
    if (this.ordersLoading || this.endReached) return;
    this.ordersLoading = true;

    const lastResult = this.orders[this.orders.length - 1];
    this.orderService
      .getOrders({ lastDocId: lastResult.id })
      .subscribe((orders) => {
        if (orders.length === 0) {
          this.endReached = true;
        } else {
          this.orders.push(...orders);
        }
        this.ordersLoading = false;
      });
  }

  openDialog(data: Order) {
    this.dialog.open(OrderDetailComponent, {
      data: data,
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }

  async toggleOrderStatus(order: Order, status: OrderStatus) {
    if (
      !confirm('Are you sure you want to change the status?') ||
      order.status === status
    ) {
      return;
    }

    this.orderService.toggleStatus(order, status).subscribe((response) => {
      if (response.error) {
        this.toastr.error(response.error);
      } else {
        const index = this.orders.findIndex((o) => o.id === order.id);
        this.orders[index].status = response.status;
        this.toastr.success('Order status updated successfully');
      }
    });
  }

  formatDate(date: Date): string {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  }
}
