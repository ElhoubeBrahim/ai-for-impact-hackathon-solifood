import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { BasketService } from '../../core/services/basket.service';
import { Basket } from '../../core/model/basket';
import { ButtonComponent } from '../../shared/component/button/button.component';
import { InputComponent } from '../../shared/component/input/input.component';
import { MapComponent } from '../../shared/component/map/map.component';
import { FileInputComponent } from '../../shared/component/file-input/file-input.component';
import { TagsInputComponent } from '../../shared/component/tags-input/tags-input.component';
import { ChoiceComponent } from '../../shared/component/choice/choice.component';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';

@Component({
  selector: 'app-basket-form',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    InputComponent,
    FileInputComponent,
    TagsInputComponent,
    ChoiceComponent,
    MapComponent,
  ],
  templateUrl: './basket-form.component.html',
})
export class BasketFormComponent implements OnInit {
  private service = inject(BasketService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  basket = {
    title: '',
    description: '',
    images: [] as string[],
    location: { lat: 0, lon: 0 },
    available: true,
    tags: [] as string[],
    ingredients: [] as string[],
    expiredAt: dayjs().format('YYYY-MM-DD'),
  };

  loading = false;
  mapCenter = { latitude: 0, longitude: 0 };
  isEditMode = false;
  images: File[] = [];
  basketId: string | null = null;

  ngOnInit() {
    this.getUserLocation();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.basketId = params['id'];
        this.isEditMode = true;
        this.loadBasket();
      }
    });
  }

  getUserLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.mapCenter = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          this.basket.location = {
            lat: this.mapCenter.latitude,
            lon: this.mapCenter.longitude,
          };
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  loadBasket() {
    if (this.basketId) {
      this.service.getBasket(this.basketId).subscribe({
        next: (basket) => {
          this.basket = {
            title: basket.title,
            description: basket.description,
            images: basket.images,
            location: basket.location,
            available: basket.available,
            tags: basket.tags,
            ingredients: basket.ingredients,
            expiredAt: dayjs(basket.expiredAt).format('YYYY-MM-DD'),
          };
          this.mapCenter = {
            latitude: this.basket.location!.lat,
            longitude: this.basket.location!.lon,
          };
        },
        error: (error) => {
          this.toastr.error('Failed to load basket');
          console.error('Error loading basket:', error);
        },
      });
    }
  }

  saveBasket() {
    if (this.loading) return;

    this.loading = true;
    if (!this.validateBasket()) {
      this.loading = false;
      this.toastr.error('Please fill all the required fields');
      return;
    }

    // First, upload images if there are any
    (this.images && this.images.length > 0
      ? this.service.uploadImages(this.images as File[])
      : of(null)
    )
      .pipe(
        switchMap((response) => {
          this.basket.images = response
            ? response.uploadedImages
            : this.basket.images;

          const data = {
            ...this.basket,
            expiredAt: Math.floor(
              dayjs(this.basket.expiredAt).valueOf() / 1000
            ),
          };

          // Pperform the create or update operation
          if (this.isEditMode && this.basketId) {
            return this.service.updateBasket(this.basketId, {
              ...data,
              blocked: false,
              claimedBy: null,
              soldAt: null,
            });
          } else {
            return this.service.createBasket(data);
          }
        }),
        catchError((error) => {
          this.toastr.error('Failed to save basket');
          console.error('Error saving basket:', error);
          return EMPTY;
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (basket) => {
          this.toastr.success(
            this.isEditMode
              ? 'Basket updated successfully'
              : 'Basket created successfully'
          );
          this.router.navigate(['/baskets']);
        },
      });
  }

  locationChange(location: { latitude: number; longitude: number }) {
    this.basket.location = {
      lat: location.latitude,
      lon: location.longitude,
    };
  }

  validateBasket() {
    return (
      this.basket.title &&
      this.basket.title.length > 0 &&
      this.basket.description &&
      this.basket.description.length > 0 &&
      this.basket.expiredAt &&
      dayjs(this.basket.expiredAt).isAfter(dayjs())
    );
  }
}
