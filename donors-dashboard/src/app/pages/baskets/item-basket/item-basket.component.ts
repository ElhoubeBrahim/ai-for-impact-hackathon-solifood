import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Basket } from '../../../core/model/basket';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import { Router, RouterLink } from '@angular/router';
import { BasketService } from '../../../core/services/basket.service';
import { ToastrService } from 'ngx-toastr';
dayjs.extend(relativeTime);

@Component({
  selector: 'app-item-basket',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './item-basket.component.html',
})
export class ItemBasketComponent {
  @Output() deleted = new EventEmitter<void>();
  @Input() basket: Basket | null = null;

  private basketService = inject(BasketService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  async deleteBasket(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!confirm('Are you sure you want to delete this basket?')) {
      return;
    }

    this.basketService.deleteBasket(this.basket!.id).subscribe(() => {
      this.toastr.success('Basket deleted successfully');
      this.deleted.emit();
    });
  }

  editBasket(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();

    this.router.navigate([`/basket/${this.basket?.id}/edit`])
  }

  timeAgo(date: Date): string {
    return dayjs(date).fromNow();
  }
}
