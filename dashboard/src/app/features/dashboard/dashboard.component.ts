import { Component, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ChartComponent } from './chart/chart.component';
import { TabsComponent } from "./tabs/tabs.component";
import { CardComponent } from './card/card.component';
import { TableComponent } from './table/table.component';
import { HttpService } from '../../core/service/http.service';
import { User } from '../../core/model/user';
import { Basket } from '../../core/model/basket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent, TabsComponent, CardComponent, TableComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  http = inject(HttpService)
  basket:Number[] = []
  order:Number[] = []
  baskets:Basket[] = []

  ngOnInit(): void {
    initFlowbite()
    this.basket = [150, 141, 145, 152, 135, 125]
    this.order = [64, 41, 76, 41, 113, 173]

    this.http.get<Basket[]>('baskets').subscribe((accounts) => {
      this.baskets = accounts;
    })
  }


}
