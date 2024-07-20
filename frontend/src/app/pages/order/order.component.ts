import { Component, OnInit, inject } from "@angular/core";
import { ButtonComponent } from "../../components/button/button.component";
import { Basket } from "../../core/models/basket";
import { BasketService } from "../../core/services/basket.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingComponent } from "../../components/loading/loading.component";
import dayjs from "dayjs";
import { ToastrService } from "ngx-toastr";
import { StorageService } from "../../core/services/storage.service";
import { flattenDiagnosticMessageText } from "typescript";

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

  isVisible = true;

  basket: Basket | null = null;

  async ngOnInit() {
    // Get basket id from route
    const basketId = this.route.snapshot.paramMap.get("id") || "";

    // Get basket from service
    ((this.service.getBasket(basketId))).subscribe(data => { this.basket = data; })

    setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }

  goToHome(){
    this.router.navigate(["/explore"]);
  }
  formatDate(date: Date): string {
    return dayjs(date).format("DD/MM/YYYY HH:mm");
  }
}
