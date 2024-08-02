import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Observable, of } from 'rxjs';
import { HttpService } from '../../core/services/http.service';
import { User } from '../../core/model/user';
import { LoadingComponent } from '../../shared/page/loading/loading.component';
import { NoDataComponent } from '../../shared/component/no-data/no-data.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterModule,
    RouterLink,
    CommonModule,
    FormsModule,
    LoadingComponent,
    NoDataComponent
  ],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  http = inject(HttpService);

  user: User[] = []
  users!: Observable<User[]>
  search: string = ''

  endReached = false;
  usersLoading = false;
  loading = false;

  ngOnInit(): void {
    initFlowbite();
    this.http.get<User>("/data/users.json").subscribe((data:any) => {
      this.user = data
      this.users = of(data)
    })
  }

  filterDemands() { 
    console.log(this.search);
    
    this.users = of(
      this.user.filter((user: User) =>  user.firstName.includes(this.search.replace(' ', '')) || user.lastName.includes(this.search.replace(' ', '')) || user.email.includes(this.search.replace(' ', ''))  || (user.firstName+' '+user.lastName).includes(this.search)) 
    )
  }
}
