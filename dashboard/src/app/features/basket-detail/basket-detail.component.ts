import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../shared/component/button/button.component';
import { LoadingComponent } from '../../shared/page/loading/loading.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import { Basket } from '../../core/model/basket';
import { BasketService } from '../../core/service/basket.service';
import { StorageService } from '../../core/service/storage.service';
import { HttpService } from '../../core/service/http.service';

@Component({
  selector: 'app-basket-detail',
  standalone: true,
  imports: [
    ButtonComponent,
    LoadingComponent,
    RouterLink,
  ],
  templateUrl: './basket-detail.component.html'
})
export class BasketDetailComponent {
  private route = inject(ActivatedRoute);
  public storage = inject(StorageService);
  private http = inject(HttpService);
  private router = inject(Router);
  basket: Basket | null = null;
  mapCenter = { latitude: 0, longitude: 0 };
  activeImage = 0;
  isReportModalOpen = false;

  async ngOnInit() {
    const basketId = this.route.snapshot.paramMap.get('id') || '';
    this.http.get<Basket>(`baskets/${basketId}`).subscribe((baskets) => {
      this.basket = baskets;
    })
    if (!this.basket) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.mapCenter = {
      latitude: this.basket.location.lat,
      longitude: this.basket.location.lon,
    };
  }

  orderBasket() {
    let id = this.basket?.id;

  }

  timeAgo(date: Date): string {
    return dayjs(date).fromNow(true);
  }

  openReportModal() {
    this.isReportModalOpen = true;
  }

  closeReportModal() {
    this.isReportModalOpen = false;
  }
}
