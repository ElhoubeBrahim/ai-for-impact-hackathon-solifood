import { Component, OnInit, inject } from "@angular/core";
import { ButtonComponent } from "../../components/button/button.component";
import { Basket } from "../../core/models/basket";
import { BasketService } from "../../core/services/basket.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingComponent } from "../../components/loading/loading.component";
import dayjs from "dayjs";
import { ToastrService } from "ngx-toastr";
import { StorageService } from "../../core/services/storage.service";

@Component({
  selector: "app-order",
  standalone: true,
  imports: [ButtonComponent, LoadingComponent],
  templateUrl: "./order.component.html",
})
export class OrderComponent implements OnInit {
  public storage = inject(StorageService);
  private service = inject(BasketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  basket: Basket | null = null;

  async ngOnInit() {
    // Get basket id from route
    const basketId = this.route.snapshot.paramMap.get("id") || "";

    // Get basket from storage if exists, else get from service
    // this.basket =
    //   this.storage.basketsState.baskets.find((b) => b.id === basketId) ||
    //   (await this.service.getBasket(basketId));

    ((this.service.getBasket(basketId))).subscribe(data => { this.basket = data;})


    // If still not found, redirect to not found
    if (!this.basket) {
      this.router.navigate(["/not-found"]);
    }


  }



  // willExpireSoon(): boolean {
  //   if (!this.basket) return false;

  //   const now = dayjs();
  //   const willExpireAt = dayjs(this.basket.expiredAt.toDate());

  //   return willExpireAt.diff(now, "day") < 1; // less than 1 day
  // }

  formatDate(date: Date): string {
    return dayjs(date).format("DD/MM/YYYY HH:mm");
  }
}