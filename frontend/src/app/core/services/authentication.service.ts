import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { UserSignup } from '../models/user';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private auth: Auth) {}

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
}
