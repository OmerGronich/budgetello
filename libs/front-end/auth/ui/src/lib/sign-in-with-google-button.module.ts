import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInWithGoogleButtonComponent } from './sign-in-with-google-button.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [CommonModule, ButtonModule],
  declarations: [SignInWithGoogleButtonComponent],
  exports: [SignInWithGoogleButtonComponent],
})
export class SignInWithGoogleButtonModule {}
