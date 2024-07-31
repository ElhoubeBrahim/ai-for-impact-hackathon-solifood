import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Basket } from '../../core/models/basket';
import { ButtonComponent } from '../../components/button/button.component';
import { TagsInputComponent } from '../../components/tags-input/tags-input.component';
import { ChoiceComponent } from '../../components/choice/choice.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../components/loading/loading.component';
import { NoDataComponent } from '../../components/no-data/no-data.component';
import { BasketComponent } from '../../shared/basket/basket.component';
import { BasketService } from '../../core/services/basket.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { lastValueFrom } from 'rxjs';
import { icon, Layer, MapOptions, marker, tileLayer } from 'leaflet';
import { Router } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    ButtonComponent,
    TagsInputComponent,
    ChoiceComponent,
    CommonModule,
    FormsModule,
    LoadingComponent,
    NoDataComponent,
    BasketComponent,
    InfiniteScrollModule,
    LeafletModule,
  ],
  templateUrl: './explore.component.html',
})
export class ExploreComponent implements OnInit {
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private basket = inject(BasketService);
  @ViewChild('notification') notification!: ElementRef;
  statusMenuNotification: boolean = false;
  @ViewChild('btnCloseNotification') btnCloseNotification!: ElementRef;

  isMapView = false;

  filters = {
    maxDistance: 300,
    sortBy: 'newest',
    tags: [],
  };
  isSearchMode = false;
  searchQuery = '';
  baskets: Basket[] = [];
  endReached = false;
  basketsLoading = false;

  mapOptions: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }),
    ],
    zoom: 5,
    center: [0, 0],
  };

  layers: Layer[] = [];

  async ngOnInit() {
    await this.loadBaskets();
  }

  async loadBaskets() {
    // Get last result to start after
    this.endReached = false;
    const lastResult =
      this.baskets.length > 0 ? this.baskets[this.baskets.length - 1] : null;

    const data = await lastValueFrom(this.basket.getBaskets(lastResult));
    this.baskets = [...this.baskets, ...data];

    // If no baskets, end reached
    this.endReached = data.length === 0;
    this.plotBasketsOnMap();
  }

  plotBasketsOnMap() {
    this.layers = [];

    this.baskets.forEach((basket) => {
      this.layers.push(
        marker([basket.location.lat, basket.location.lon], {
          icon: icon({
            iconUrl: '/assets/marker-icon.png',
            iconAnchor: [19, 35],
          }),
        })
          .on('click', (event) => {
            this.ngZone.run(() => this.router.navigate(['/explore', basket.id]));
          })
          .bindPopup(
            `
            <div class="font-bold mb-[5px]">${basket.title}</div>
            <div class="d-flex gap-2 items-center mb-[10px] text-gray-500">
              <span>0.3km</span>
            </div>
            <div>${basket.description}</div>
          `,
            {
              offset: [0, -30],
            },
          )
          .on('mouseover', (event) => {
            event.target.openPopup();
          }),
      );
    });
  }

  async handleScroll() {
    if (this.basketsLoading || this.endReached || this.isSearchMode) return;
    this.basketsLoading = true;
    await this.loadBaskets();
    this.basketsLoading = false;
  }

  actionDrawer(): void {
    if (this.statusMenuNotification) {
      this.notification.nativeElement.style.right = '-300px';
    } else {
      this.notification.nativeElement.style.right = '0px';
    }
    this.statusMenuNotification = !this.statusMenuNotification;
  }

  async searchBaskets() {
    if (!this.searchQuery) return;
    this.basketsLoading = true;
    this.endReached = false;

    // Reset baskets
    this.baskets = [];

    // Get baskets ID from the search API
    this.baskets = await lastValueFrom(
      this.basket.searchBaskets(this.searchQuery),
    );
    this.endReached = true;
    this.basketsLoading = false;
    this.isSearchMode = true;

    this.plotBasketsOnMap();
  }

  async resetSearch() {
    this.searchQuery = '';
    this.isSearchMode = false;
    this.basketsLoading = true;

    // Reset baskets
    this.baskets = [];

    // Load baskets
    this.loadBaskets();
    this.basketsLoading = false;
  }

  filterBaskets() {
    console.log(this.filters);
  }
}
