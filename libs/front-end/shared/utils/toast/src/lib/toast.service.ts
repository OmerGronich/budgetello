import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  handleSignInErrors(error: FirebaseError) {
    switch (error.code) {
      case 'auth/user-not-found':
        this.userNotFoundErrorMessage();
        break;
      default:
        return this.somethingWentWrongErrorMessage();
    }
  }

  handleRegisterErrors(error: FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.emailAlreadyInUseMessage();
        break;
      default:
        return this.somethingWentWrongErrorMessage();
    }
  }

  passwordsDoNotMatchMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Passwords do not match',
      detail: 'Please try again.',
    });
  }

  emailAlreadyInUseMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Email already in use',
      detail: 'Please try another email address.',
    });
  }

  userNotFoundErrorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'User not found.',
    });
  }

  somethingWentWrongErrorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Something went wrong.',
    });
  }

  invalidEmailErrorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please enter a valid email address.',
    });
  }

  wrongPasswordErrorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Wrong password.',
    });
  }

  duplicateStock() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Duplicate stock.',
    });
  }
}
