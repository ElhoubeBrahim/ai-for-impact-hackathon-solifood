import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonItem, IonIcon, IonLabel, IonNote, IonTitle, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle } from 'ionicons/icons';
import { Timestamp } from '@angular/fire/firestore';
import { ButtonComponent } from 'src/app/components/button/button.component';

@Component({
  selector: 'app-view-basket',
  templateUrl: './view-basket.page.html',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons,IonButton, IonBackButton, IonContent, IonItem, IonIcon, IonLabel, IonNote, IonTitle, ButtonComponent, CommonModule]
})
export class ViewBasketPage implements OnInit {
  public basket = {
    id: "1",
    title: "Basket 1",
    description: "This is the description for Basket 1",
    images: [
      "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
      "https://images.radio-canada.ca/v1/alimentation/recette/16x9/ogleman-spaghetti-boulettes.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSokLLpaQWJPa-IJ33ei_rWnxY7Z1Qi5GLZhw&s"

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
  };
  currentImage: string = "";
  currentIndex: number = 0;
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  activeImage = 0;

  constructor() {
    addIcons({ personCircle });
  }

  // ngOnInit() {
  //   // const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
  //   // this.message = this.data.getMessageById(parseInt(id, 10));
  // }

  ngOnInit() {
    this.startImageRotation();
  }

  startImageRotation() {
    this.currentImage = this.basket.images[this.currentIndex];
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.basket.images.length;
      this.currentImage = this.basket.images[this.currentIndex];
    }, 3000);
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Baskets' : '';
  }

}
