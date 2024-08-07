import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { Order } from '../../../core/model/order';
import { RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { ButtonComponent } from '../../../shared/component/button/button.component';

dayjs.extend(relativeTime);

@Component({
  selector: 'app-order-detail',
  standalone: true,
    imports: [MatDialogModule,RouterLink,ButtonComponent],
  templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent {
  activeImage = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Order) {}
  timeAgo(date: Date): string {
    return dayjs(date).fromNow();
  }
  orderBasket(){}
}
