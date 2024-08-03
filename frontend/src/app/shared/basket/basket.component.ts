import { Component, Input } from '@angular/core';
import { Basket } from '../../core/models/basket';
import { RouterLink } from '@angular/router';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './basket.component.html',
})
export class BasketComponent {
  @Input() basket: Basket | null = null;
  @Input() userLocation: { lat: number; lon: number } = { lat: 0, lon: 0 };

  timeAgo(date: Date): string {
    return dayjs(date).fromNow();
  }

  calculateDistance() {
    const location = this.basket?.location;
    const center = this.userLocation;

    if (!location) {
      return 0;
    }

    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(center.lat - location.lat);
    const dLon = this.toRadians(center.lon - location.lon);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(location.lat)) *
        Math.cos(this.toRadians(center.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return this.formatDistance(Number(distance.toFixed(2)));
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private formatDistance(distance: number): string {
    if (distance < 1) {
      const meters = Math.round(distance * 1000);
      return `${meters} ${meters === 1 ? 'meter' : 'meters'} away`;
    } else if (distance < 10) {
      return `${distance.toFixed(1)} km away`;
    } else {
      return `${Math.round(distance)} km away`;
    }
  }
}
