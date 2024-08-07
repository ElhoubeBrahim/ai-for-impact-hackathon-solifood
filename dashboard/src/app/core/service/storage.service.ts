import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private userSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
  public user$: Observable<User | undefined> = this.userSubject.asObservable();

  setUser(user: User | undefined): void {
    this.userSubject.next(user);
  }

  getUser(): User | undefined {
    return this.userSubject.getValue();
  }
}
