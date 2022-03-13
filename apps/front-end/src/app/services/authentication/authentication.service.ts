import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { ToastService } from '../toast/toast.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  usernamePasswordLoading = false;

  get user$() {
    return this.auth.user;
  }

  constructor(
    private auth: AngularFireAuth,
    private toastService: ToastService,
    private router: Router,
    private logger: LoggerService
  ) {}

  async signInWithGoogle() {
    try {
      await this.auth.signInWithPopup(new GoogleAuthProvider());
      this.router.navigateByUrl('/');
    } catch (error) {
      this.toastService.somethingWentWrongErrorMessage();
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    let error: FirebaseError | null = null;
    try {
      this.usernamePasswordLoading = true;
      await this.auth.signInWithEmailAndPassword(email, password);
    } catch (_error) {
      this.logger.log({ error: _error });
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
      this.logger.log({ error: _error });
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
