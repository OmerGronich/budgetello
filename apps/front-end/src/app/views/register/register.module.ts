import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { PasswordSuggestionsModule } from '../../components/password-suggestions/password-suggestions.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { RouterModule } from '@angular/router';
import { TitleModule } from '../../components/title/title.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    DividerModule,
    PasswordSuggestionsModule,
    AngularFireAuthModule,
    ToastModule,
    MessageModule,
    RouterModule,
    TitleModule,
  ],
})
export class RegisterModule {}
