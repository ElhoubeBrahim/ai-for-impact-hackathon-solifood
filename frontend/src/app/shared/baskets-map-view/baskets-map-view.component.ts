import { Component, inject, NgZone, ViewChild } from '@angular/core';
import { LeafletDirective, LeafletModule } from '@asymmetrik/ngx-leaflet';
import { icon, Layer, Map, MapOptions, marker, tileLayer } from 'leaflet';
import { lastValueFrom } from 'rxjs';
import { BasketService } from '../../core/services/basket.service';
import { Basket } from '../../core/models/basket';
import { NoDataComponent } from '../../components/no-data/no-data.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-baskets-map-view',
  standalone: true,
  imports: [LeafletModule, NoDataComponent, LoadingComponent],
  templateUrl: './baskets-map-view.component.html',
})
export class BasketsMapViewComponent {
  private basket = inject(BasketService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  baskets: Basket[] = [];
  loading = true;
  userLocation = { lat: 0, lon: 0 };

  @ViewChild(LeafletDirective) leafletDirective!: LeafletDirective;
  mapOptions: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }),
    ],
    zoom: 13,
    center: [0, 0],
  };
  private map!: Map;
  layers: Layer[] = [];

  async ngOnInit() {
    await this.getUserLocation();
    await this.loadBaskets();
  }

  async getUserLocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = {
              // Use hardcoded location for now
              lat: 33.58236235230457, // position.coords.latitude,
              lon: -7.559974238675994, // position.coords.longitude,
            };
            this.mapOptions.center = [
              this.userLocation.lat,
              this.userLocation.lon,
            ];
            resolve();
          },
          (error) => {
            console.error('Error getting user location:', error);
            reject(error);
          },
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        reject(new Error('Geolocation not supported'));
      }
    });
  }

  onMapReady(map: Map) {
    this.map = map;
  }

  async loadBaskets() {
    this.loading = true;
    this.baskets = await lastValueFrom(
      this.basket.getNearbyBaskets(
        this.userLocation.lat,
        this.userLocation.lon,
        5000, // 5 Km
      ),
    );
    this.plotBasketsOnMap();
    this.loading = false;
  }

  plotBasketsOnMap() {
    this.layers = [];

    // Plot user location
    this.layers.push(
      marker([this.userLocation.lat, this.userLocation.lon], {
        icon: icon({
          iconUrl: '/assets/user-location-marker.png',
        }),
      }).on('click', (event) => {
        // Zoom to user location
        this.map.setView([this.userLocation.lat, this.userLocation.lon], 18);
      }),
    );

    // Plot baskets
    this.baskets.forEach((basket) => {
      this.layers.push(
        marker([basket.location.lat, basket.location.lon], {
          icon: icon({
            iconUrl: '/assets/marker-icon.png',
            iconAnchor: [19, 35],
          }),
        })
          .on('click', (event) => {
            this.ngZone.run(() =>
              this.router.navigate(['/explore', basket.id]),
            );
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

  async searchBaskets(query: string) {
    console.log('searching baskets: ', query);
  }
}
