import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup
} from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { User, UserSignup } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private auth: Auth,
    private http: HttpClient,
  ) {}

  public async signUp(userData: UserSignup) {
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password,
      );

      // Initialize user
      const user = {
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

      // Save user data
      await this.saveUser(user);

      // Return user data
      return {
        error: null,
        user,
      };
    } catch (error: any) {
      return {
        error,
        user: null,
      };
    }
  }

  public async signIn(email: string, password: string) {
    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      // Return user data
      return {
        error: null,
        user: userCredential.user,
      };
    } catch (error: any) {
      return {
        error,
        user: null,
      };
    }
  }

  public async signInWithGoogle() {
    // Show Google sign in popup
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(this.auth, provider);

    // Check if user has an email
    if (userCredential.user.email === null) {
      return {
        error: 'Google sign in failed',
        user: null,
      };
    }

    // Get user data
    const [firstName, lastName] = userCredential.user.displayName?.split(
      ' ',
    ) || ['', ''];

    // Initialize user
    const user = {
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

    // Save user data
    await this.saveUser(user);

    // Return user data
    return {
      error: null,
      user,
    };
  }

  public signOut() {
    this.auth.signOut();
  }

  public async saveUser(user: User) {
    await lastValueFrom(this.http.post('/profile/save', user));
  }

  public async getCurrentUser() {
    try {
      // Get user data
      const user = await lastValueFrom<User>(this.http.get<User>('/profile/'));

      // Return user data
      return {
        error: null,
        user,
      };
    } catch (error: any) {
      return {
        error,
        user: null,
      };
    }
  }

  public async getAccessToken() {
    const token = await this.auth.currentUser?.getIdToken();
    return token;
  }
}
