import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { User, UserSignup } from '../models/user';
import { Timestamp } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

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

  public async saveUser(user: User) {
    await lastValueFrom(this.http.post('/profile/save', user));
  }
}
