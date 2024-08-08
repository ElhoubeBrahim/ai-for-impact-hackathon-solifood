import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Order } from '../../../core/model/order';
import { RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ButtonComponent } from '../../../shared/component/button/button.component';
import { CommonModule } from '@angular/common';

dayjs.extend(relativeTime);

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [MatDialogModule, RouterLink, ButtonComponent, CommonModule],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent {
  activeImage = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Order) {}
  formatDate(date: Date): string {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  }

  currentSlideIndex = 0;

  prevSlide() {
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.data.basket.images.length) %
      this.data.basket.images.length;
  }

  nextSlide() {
    this.currentSlideIndex =
      (this.currentSlideIndex + 1) % this.data.basket.images.length;
  }
}
