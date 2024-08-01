import { Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { TagsInputComponent } from '../../components/tags-input/tags-input.component';
import { ChoiceComponent } from '../../components/choice/choice.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasketsListViewComponent } from '../../shared/baskets-list-view/baskets-list-view.component';
import { BasketsMapViewComponent } from '../../shared/baskets-map-view/baskets-map-view.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    ButtonComponent,
    TagsInputComponent,
    ChoiceComponent,
    CommonModule,
    FormsModule,
    BasketsListViewComponent,
    BasketsMapViewComponent,
  ],
  templateUrl: './explore.component.html',
})
export class ExploreComponent {
  @ViewChild('notification') notification!: ElementRef;
  statusMenuNotification: boolean = false;
  @ViewChild('btnCloseNotification') btnCloseNotification!: ElementRef;

  @ViewChild(BasketsListViewComponent) listViewCpm!: BasketsListViewComponent;
  @ViewChild(BasketsMapViewComponent) mapViewCpm!: BasketsMapViewComponent;

  isMapView = false;

  filters = {
    maxDistance: 300,
    sortBy: 'newest',
    tags: [],
  };
  isSearchMode = false;
  searchQuery = '';
  basketsLoading = false;

  actionDrawer(): void {
    if (this.statusMenuNotification) {
      this.notification.nativeElement.style.right = '-300px';
    } else {
      this.notification.nativeElement.style.right = '0px';
    }
    this.statusMenuNotification = !this.statusMenuNotification;
  }

  async searchBaskets() {
    this.basketsLoading = true;
    await (this.isMapView
      ? this.mapViewCpm.searchBaskets(this.searchQuery)
      : this.listViewCpm.searchBaskets(this.searchQuery));
    this.basketsLoading = false;
  }

  async resetSearch() {
    this.basketsLoading = true;
    this.searchQuery = '';
    this.isSearchMode = false;

    this.listViewCpm.baskets = [];
    await this.listViewCpm.loadBaskets();
    this.basketsLoading = false;
  }

  filterBaskets() {
    console.log(this.filters);
  }
}
