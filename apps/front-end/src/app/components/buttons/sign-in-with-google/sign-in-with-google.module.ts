import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInWithGoogleComponent } from './sign-in-with-google.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [SignInWithGoogleComponent],
  imports: [CommonModule, ButtonModule],
  exports: [SignInWithGoogleComponent],
})
export class SignInWithGoogleModule {}
