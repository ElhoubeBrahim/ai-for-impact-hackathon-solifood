import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar ,IonRefresher, IonRefresherContent, IonList, IonButton, RefresherCustomEvent } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { Basket } from 'src/app/core/models/basket';
import { Timestamp } from '@angular/fire/firestore';
import { BasketPage } from "../basket/basket.page";
import { InputComponent } from "../../components/input/input.component";
import { BasketService } from 'src/app/core/services/basket.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonButton, IonToolbar, IonRefresher, IonRefresherContent, IonList, CommonModule, FormsModule, BasketPage, InputComponent]
})
export class ExplorePage implements OnInit  {

  private basket = inject(BasketService);
  searchQuery:string = ""
  baskets: Basket[] = [];
  constructor() {}
  endReached = false;
  userLocation = { lat: 0, lon: 0 };
  filters = {};

  ngOnInit(): void {
    this.loadBaskets();
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  async loadBaskets() {
    // Get last result to start after
    this.endReached = false;
    const lastResult =
      this.baskets.length > 0 ? this.baskets[this.baskets.length - 1] : null;

    const data = await lastValueFrom(
      this.basket.getBaskets({
        lastResult,
        latitude: this.userLocation.lat,
        longitude: this.userLocation.lon,
        ...this.filters,
      }),
    );
    this.baskets = [...this.baskets, ...data];

    // If no baskets, end reached
    this.endReached = data.length === 0;
  }


}
