import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ChartComponent } from './chart/chart.component';
import { TabsComponent } from "./tabs/tabs.component";
import { CardComponent } from './card/card.component';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent, TabsComponent, CardComponent, TableComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  basket:Number[] = []
  reservation:Number[] = []

  ngOnInit(): void {
    initFlowbite()
    this.basket = [150, 141, 145, 152, 135, 125]
    this.reservation = [64, 41, 76, 41, 113, 173]
  }
}
