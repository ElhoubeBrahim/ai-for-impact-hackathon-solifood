import { Component, inject, Input, OnInit } from '@angular/core';
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

  @Input() baskets:Basket[] = [];  
  orders:Basket[] = [];
  
  ngOnInit(): void {

  }
}
