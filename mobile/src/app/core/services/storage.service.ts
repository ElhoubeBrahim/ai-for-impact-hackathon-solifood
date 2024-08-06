import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private userSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<
    User | undefined
  >(undefined);
  public user$: Observable<User | undefined> = this.userSubject.asObservable();

  constructor() {}

  setUser(user: User | undefined): void {
    this.userSubject.next(user);
  }

  getUser(): User | undefined {
    return this.userSubject.getValue();
  }
}
