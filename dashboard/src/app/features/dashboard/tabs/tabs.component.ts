import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../core/service/http.service';
import { Basket } from '../../../core/model/basket';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html'
})
export class TabsComponent implements OnInit{
  http = inject(HttpService);

  baskets:Basket[] = [];  
  orders:Basket[] = [];
  
  ngOnInit(): void {
    this.http.get<Basket[]>('/data/baskets.json').subscribe((response:Basket[]) => {
      this.baskets = response;
    })
    this.http.get<Basket[]>('/data/reservations.json').subscribe((response:Basket[]) => {
      this.orders = response;
    })
  }
}
