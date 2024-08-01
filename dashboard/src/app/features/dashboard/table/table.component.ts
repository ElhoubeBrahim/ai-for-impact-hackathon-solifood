import { Component } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html'
})
export class TableComponent {
  headers = ['Baskets', 'Users', 'Report Date', 'Reporter', 'Action'];
  data = [
    {
      "Basket": "Basket 001",
      "User": "John Doe",
      "DateReport": "2024-08-01",
      "Reporter": "Jane Smith",
    },
    {
      "Basket": "Basket 002",
      "User": "Alice Johnson",
      "DateReport": "2024-08-02",
      "Reporter": "Michael Brown",
    },
    {
      "Basket": "Basket 003",
      "User": "Bob Smith",
      "DateReport": "2024-08-03",
      "Reporter": "John Doe",
    },
  ];
}
