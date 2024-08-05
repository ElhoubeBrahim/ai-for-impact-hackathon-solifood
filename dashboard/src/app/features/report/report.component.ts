import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../core/model/user';
import { Observable, of } from 'rxjs';
import { initFlowbite } from 'flowbite';
import { HttpService } from '../../core/service/http.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';
import { LoadingComponent } from '../../shared/page/loading/loading.component';
import { Basket } from '../../core/model/basket';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    RouterModule,
    RouterLink,
    CommonModule,
    FormsModule,
    LoadingComponent,
    NoDataComponent
  ],
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  http = inject(HttpService);

  report: Basket[] = []
  search: string = ''

  endReached = false;
  usersLoading = false;
  loading = true;
  
  ngOnInit(): void {
    initFlowbite();
    this.http.get<Basket[]>('reports').subscribe((report) => {
      this.report = report;
      this.loading = false;
    })
  }

  filterDemands() { 

  }
}