import {
  Component,
  ElementRef,
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
  ],
  templateUrl: './explore.component.html',
})
export class ExploreComponent implements OnInit {
  private basket = inject(BasketService);
  @ViewChild('notification') notification!: ElementRef;
  statusMenuNotification: boolean = false;
  @ViewChild('btnCloseNotification') btnCloseNotification!: ElementRef;

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

  ngOnInit() {
    this.loadBaskets();
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
  async resetSearch() {
    this.searchQuery = '';
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
