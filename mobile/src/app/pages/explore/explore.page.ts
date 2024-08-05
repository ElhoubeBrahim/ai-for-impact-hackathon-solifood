import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar ,IonRefresher, IonRefresherContent, IonList, IonButton, RefresherCustomEvent } from '@ionic/angular/standalone';

import { Basket } from 'src/app/models/basket';
import { Timestamp } from '@angular/fire/firestore';
import { BasketPage } from "../basket/basket.page";
import { InputComponent } from "../../components/input/input.component";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonButton, IonToolbar, IonRefresher, IonRefresherContent, IonList, CommonModule, FormsModule, BasketPage, InputComponent]
})
export class ExplorePage {

  searchQuery:string = ""
  baskets: Basket[] = [
    {
      id: "1",
      title: "Basket 1",
      description: "This is the description for Basket 1",
      images: [
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
        "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
      ],
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
  constructor() {}

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }


}
