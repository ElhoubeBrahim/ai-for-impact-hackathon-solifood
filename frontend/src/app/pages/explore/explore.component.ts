import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Timestamp } from "@angular/fire/firestore";
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
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [ButtonComponent, TagsInputComponent, ChoiceComponent, CommonModule, FormsModule, LoadingComponent, NoDataComponent, BasketComponent],
  templateUrl: './explore.component.html',
})
export class ExploreComponent implements OnInit {

  private basket = inject(BasketService);
  public storage = inject(StorageService);
  @ViewChild("notification") notification!: ElementRef;
  statusMenuNotification: boolean = false;
  @ViewChild("btnCloseNotification") btnCloseNotification!: ElementRef;


  filters = {
    maxDistance: 300,
    sortBy: "newest",
    tags: [],
  };
  isSearchMode = false;
  searchQuery = "";
  baskets : Basket[] = []

  ngOnInit() {
    this.loadBaskets();
  }


  async loadBaskets() {
    // Get last result to start after
    this.storage.basketsState.endReached = false;
    const basketsCount = this.storage.basketsState.baskets.length;
    const lastResult =
      basketsCount > 0
        ? this.storage.basketsState.baskets[basketsCount - 1]
        : null;

    (await this.basket.getBaskets()).subscribe(data => { this.baskets = data})

    // If no baskets, end reached
    if (this.baskets.length === 0) {
      this.storage.basketsState.endReached = true;
      return;
    }

    // Add baskets to storage
    this.storage.basketsState.baskets = [
      ...this.storage.basketsState.baskets,
      ...this.baskets,
    ];
    this.storage.basketsState.loaded = true;
  }


  async handleScroll() {
    // if (
    //   this.basketsLoading ||
    //   this.storage.basketsState.endReached ||
    //   this.isSearchMode
    // )
    //   return;

    // this.basketsLoading = true;
    // await this.loadBaskets();
    // this.plotBasketsOnMap();
    // this.basketsLoading = false;
  }

  actionDrawer(): void {
    if (this.statusMenuNotification) {
      this.notification.nativeElement.style.right = "-300px";
    } else {
      this.notification.nativeElement.style.right = "0px";
    }
    this.statusMenuNotification = !this.statusMenuNotification;
  }
  async resetSearch() {
    this.searchQuery = "";
    this.isSearchMode = false;
    // this.basketsLoading = true;
    // this.recording = false;
    // this.chunks = [];

    // // Reset baskets
    // this.storage.basketsState.baskets = [];

    // // Load baskets
    // await this.loadBaskets();
    // this.plotBasketsOnMap();
    // this.basketsLoading = false;
  }

  filterBaskets() {
    console.log(this.filters);
  }
}
