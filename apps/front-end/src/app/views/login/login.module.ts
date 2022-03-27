import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TitleModule } from '../../components/title/title.module';
import { SignInWithGoogleModule } from '../../components/buttons/sign-in-with-google/sign-in-with-google.module';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    LoginRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    DividerModule,
    InputTextModule,
    ToastModule,
    ButtonModule,
    RouterModule,
    TitleModule,
    SignInWithGoogleModule,
  ],
})
export class LoginModule {}
