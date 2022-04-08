import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordInputComponent } from './password-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, PasswordModule],
  declarations: [PasswordInputComponent],
  exports: [PasswordInputComponent],
})
export class UiPasswordInputModule {}
