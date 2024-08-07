import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { HttpService } from '../../core/service/http.service';
import { User } from '../../core/model/user';
import { LoadingComponent } from '../../shared/page/loading/loading.component';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterModule,
    RouterLink,
    CommonModule,
    FormsModule,
    LoadingComponent,
    NoDataComponent,
    CdkAccordionModule
  ],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  http = inject(HttpService);

  user: User[] = []
  endReached = false;
  usersLoading = false;
  loading = false;

  ngOnInit(): void {
    initFlowbite();
      this.http.get<User[]>('accounts').subscribe((accounts) => {
        this.user = accounts;
        console.log(accounts);
        
      })
  }

  filterDemands(search: string) { 
    this.loading = true;
    this.http.get<User[]>(`accounts?search=${search}`).subscribe((accounts) => {
      this.user = accounts;
      this.loading = false;
    })
  }

  timeAgo(date: Date): string {
    return dayjs(date).fromNow();
  }
}
