import { Component, Input } from '@angular/core';
import { Basket } from '../../../core/model/basket';
import dayjs from 'dayjs';


import relativeTime from "dayjs/plugin/relativeTime";
import { RouterLink } from '@angular/router';
dayjs.extend(relativeTime);

@Component({
  selector: 'app-item-basket',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './item-basket.component.html'
})
export class ItemBasketComponent {
  @Input() basket: Basket | null = null;

  timeAgo(date: Date): string {
    return dayjs(date).fromNow();
  }
}
