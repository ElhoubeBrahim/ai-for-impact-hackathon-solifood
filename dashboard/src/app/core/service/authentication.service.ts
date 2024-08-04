import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User as FirebaseUser,
  UserCredential
} from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { User, UserSignup } from '../model/user';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private auth = inject(Auth);
  private httpService = inject(HttpService);

  signUp(userData: UserSignup): Observable<{ error: any; user: User | null }> {
    return from(createUserWithEmailAndPassword(this.auth, userData.email, userData.password)).pipe(
      switchMap((userCredential: UserCredential) => {
        const user: User = {
          id: userCredential.user.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          picture: userCredential.user.photoURL || 'assets/user.svg',
          email: userData.email,
          location: {
            lat: 0,
            lon: 0,
          },
          ratings: [],
          blocked: false,
          lastLogin: Timestamp.now(),
          joinedAt: Timestamp.now(),
        };

        return this.httpService.post<any,User>('profile/save',user).pipe(
          map(() => ({ error: null, user }))
        );
      })
    );
  }

  public signIn(email: string, password: string): Observable<{ error: any; user: FirebaseUser | null }> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => ({ error: null, user: userCredential.user }))
    );
  }

  public signInWithGoogle(): Observable<{ error: any; user: User | null }> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((userCredential: UserCredential) => {
        if (!userCredential.user.email) {
          return throwError(() => new Error('Google sign in failed'));
        }

        const [firstName, lastName] = userCredential.user.displayName?.split(' ') || ['', ''];
        const user: User = {
          id: userCredential.user.uid,
          firstName,
          lastName,
          picture: userCredential.user.photoURL || 'assets/user.svg',
          email: userCredential.user.email,
          location: {
            lat: 0,
            lon: 0,
          },
          ratings: [],
          blocked: false,
          lastLogin: Timestamp.now(),
          joinedAt: Timestamp.now(),
        };

        return this.httpService.post<any,User>('profile/save',user).pipe(
          map(() => ({ error: null, user }))
        );
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.auth.signOut());
  }

  getCurrentUser(): Observable<{ error: any; user: User | null }> {
    return this.httpService.get<User>('profile').pipe(
      map(user => ({ error: null, user }))
    );
  }

  public async getAccessToken() {
    const token = await this.auth.currentUser?.getIdToken();
    return token;
  }
}