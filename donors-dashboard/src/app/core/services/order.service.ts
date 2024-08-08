import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrders(
    params: {
      lastDocId?: string;
      status?: OrderStatus;
    } = {}
  ): Observable<Order[]> {
    const { lastDocId, status } = params;

    let httpParams = new HttpParams();

    if (lastDocId) {
      httpParams = httpParams.set('lastDocId', lastDocId);
    }

    if (status) {
      httpParams = httpParams.set('status', status);
    }

    return this.http.get<Order[]>('/orders/seller', { params: httpParams });
  }

  toggleStatus(order: Order, status: OrderStatus) {
    return this.http.put<any>(`/orders/${order.id}/status`, { status });
  }
}
