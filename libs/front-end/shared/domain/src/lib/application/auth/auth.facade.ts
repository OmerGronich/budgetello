import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  usernamePasswordLoading = false;

  get user$() {
    return this.auth.user;
  }

  constructor(private auth: AngularFireAuth) {}

  signInWithGoogle() {
    return this.auth.signInWithPopup(new GoogleAuthProvider());
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    let error: FirebaseError | null = null;
    try {
      this.usernamePasswordLoading = true;
      await this.auth.signInWithEmailAndPassword(email, password);
    } catch (_error) {
      error = _error as FirebaseError;
    } finally {
      this.usernamePasswordLoading = false;
    }

    return { error };
  }

  async createUserWithEmailAndPassword(
    email: string,
    password: string,
    { displayName = '' }: { displayName: string }
  ) {
    let error: FirebaseError | null = null;
    try {
      this.usernamePasswordLoading = true;
      const { user } = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (displayName) {
        user?.updateProfile({ displayName });
      }
    } catch (_error) {
      error = _error as FirebaseError;
    } finally {
      this.usernamePasswordLoading = false;
    }

    return { error };
  }

  signOut() {
    this.auth.signOut();
  }
}
