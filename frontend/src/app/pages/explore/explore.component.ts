import { Component, ElementRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [ButtonComponent, TagsInputComponent, ChoiceComponent, CommonModule, FormsModule, LoadingComponent, NoDataComponent, BasketComponent],
  templateUrl: './explore.component.html',
})
export class ExploreComponent {

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
  baskets: Basket[] = [
    {
      id: "1",
      title: "Basket 1",
      description: "This is the description for Basket 1",
      images: [
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
      ],
      realPrice: 50,
      price: 40,
      location: { lat: 123.456, lon: 789.012 },
      available: true,
      blocked: false,
      tags: ["tag1", "tag2", "tag3"],
      ingredients: ["ingredient1", "ingredient2"],
      createdBy: {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        picture: "https://t3.ftcdn.net/jpg/04/23/59/74/360_F_423597477_AKCjGMtevfCi9XJG0M8jter97kG466y7.jpg",
        email: "john@example.com",
        location: { lat: 123.456, lon: 789.012 },
        ratings: [{ rating: 5, by: "user2" }],
        blocked: true,
        lastLogin: Timestamp.now(),
        joinedAt: Timestamp.now(),
      },
      expiredAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      claimedBy: null,
      soldAt: null
    },
    {
      id: "2",
      title: "Basket 1",
      description: "This is the description for Basket 1",
      images: [
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
      ],
      realPrice: 50,
      price: 40,
      location: { lat: 123.456, lon: 789.012 },
      available: true,
      blocked: false,
      tags: ["tag1", "tag2", "tag3"],
      ingredients: ["ingredient1", "ingredient2"],
      createdBy: {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        picture: "https://t3.ftcdn.net/jpg/04/23/59/74/360_F_423597477_AKCjGMtevfCi9XJG0M8jter97kG466y7.jpg",
        email: "john@example.com",
        location: { lat: 123.456, lon: 789.012 },
        ratings: [{ rating: 5, by: "user2" }],
        blocked: true,
        lastLogin: Timestamp.now(),
        joinedAt: Timestamp.now(),
      },
      expiredAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      claimedBy: null,
      soldAt: null
    },
    {
      id: "3",
      title: "Basket 1",
      description: "This is the description for Basket 1",
      images: [
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
      ],
      realPrice: 50,
      price: 40,
      location: { lat: 123.456, lon: 789.012 },
      available: true,
      blocked: false,
      tags: ["tag1", "tag2", "tag3"],
      ingredients: ["ingredient1", "ingredient2"],
      createdBy: {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        picture: "https://t3.ftcdn.net/jpg/04/23/59/74/360_F_423597477_AKCjGMtevfCi9XJG0M8jter97kG466y7.jpg",
        email: "john@example.com",
        location: { lat: 123.456, lon: 789.012 },
        ratings: [{ rating: 5, by: "user2" }],
        blocked: true,
        lastLogin: Timestamp.now(),
        joinedAt: Timestamp.now(),
      },
      expiredAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      claimedBy: null,
      soldAt: null
    },
    {
      id: "4",
      title: "Basket 1",
      description: "This is the description for Basket 1",
      images: [
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
      ],
      realPrice: 50,
      price: 40,
      location: { lat: 123.456, lon: 789.012 },
      available: true,
      blocked: false,
      tags: ["tag1", "tag2", "tag3"],
      ingredients: ["ingredient1", "ingredient2"],
      createdBy: {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        picture: "https://t3.ftcdn.net/jpg/04/23/59/74/360_F_423597477_AKCjGMtevfCi9XJG0M8jter97kG466y7.jpg",
        email: "john@example.com",
        location: { lat: 123.456, lon: 789.012 },
        ratings: [{ rating: 5, by: "user2" }],
        blocked: true,
        lastLogin: Timestamp.now(),
        joinedAt: Timestamp.now(),
      },
      expiredAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      claimedBy: null,
      soldAt: null
    },
    {
      id: "5",
      title: "Basket 1",
      description: "This is the description for Basket 1",
      images: [
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
      ],
      realPrice: 50,
      price: 40,
      location: { lat: 123.456, lon: 789.012 },
      available: true,
      blocked: false,
      tags: ["tag1", "tag2", "tag3"],
      ingredients: ["ingredient1", "ingredient2"],
      createdBy: {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        picture: "https://t3.ftcdn.net/jpg/04/23/59/74/360_F_423597477_AKCjGMtevfCi9XJG0M8jter97kG466y7.jpg",
        email: "john@example.com",
        location: { lat: 123.456, lon: 789.012 },
        ratings: [{ rating: 5, by: "user2" }],
        blocked: true,
        lastLogin: Timestamp.now(),
        joinedAt: Timestamp.now(),
      },
      expiredAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      claimedBy: null,
      soldAt: null
    },
  ];
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
