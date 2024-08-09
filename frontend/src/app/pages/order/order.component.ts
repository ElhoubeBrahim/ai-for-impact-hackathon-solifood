import { Component, OnInit, inject } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { Basket } from '../../core/models/basket';
import { BasketService } from '../../core/services/basket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '../../components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../core/services/storage.service';
import { InputComponent } from '../../components/input/input.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ButtonComponent, LoadingComponent, FormsModule, InputComponent],
  templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit {
  public storage = inject(StorageService);
  private service = inject(BasketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  isVisible = false;
  isOrderSubmitted = false;
  basket: Basket | null = null;
  message: string = '';

  async ngOnInit() {
    const basketId = this.route.snapshot.paramMap.get('id') || '';
    this.service.getBasket(basketId).subscribe((data) => {
      this.basket = data;
    });
  }

  submitOrder() {
    if (this.basket) {
      this.isVisible = true;
      this.service
        .orderBasket(this.basket.id, this.message)
        .subscribe((response) => {
          if (response.error) {
            this.toastr.error(response.error);
            this.isVisible = false;
            return;
          }

          this.isVisible = false;
          this.isOrderSubmitted = true;
        });
    }
  }

  goToHome() {
    this.router.navigate(['/explore']);
  }

  formatDate(date: Date): string {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  }

  timeAgo(date: Date): string {
    return dayjs(date).fromNow(true);
  }
}
