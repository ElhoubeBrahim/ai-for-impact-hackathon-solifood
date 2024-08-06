import { Component, OnInit, inject } from '@angular/core';
import dayjs from 'dayjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { BasketService } from '../../core/services/basket.service';
import { lastValueFrom } from 'rxjs';
import { ButtonComponent } from '../../shared/component/button/button.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Basket } from '../../core/model/basket';
import { MapComponent } from '../../shared/component/map/map.component';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [ButtonComponent, LoadingComponent, RouterLink, MapComponent],
  templateUrl: './basket.component.html',
})
export class BasketComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public storage = inject(StorageService);
  private service = inject(BasketService);
  private router = inject(Router);
  basket: Basket | null = null;
  mapCenter = { latitude: 0, longitude: 0 };
  activeImage = 0;

  async ngOnInit() {
    // Get basket id from route
    const basketId = this.route.snapshot.paramMap.get('id') || '';

    // Get basket if exists
    this.basket = await lastValueFrom(this.service.getBasket(basketId));

    // If still not found, redirect to not found
    if (!this.basket) {
      this.router.navigate(['/not-found']);
      return;
    }

    // Set the map center to the basket location
    this.mapCenter = {
      latitude: this.basket.location.lat,
      longitude: this.basket.location.lon,
    };
  }

  timeAgo(date: Date): string {
    return dayjs(date).fromNow(true);
  }
}
