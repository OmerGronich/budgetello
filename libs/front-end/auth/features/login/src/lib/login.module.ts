import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { TextInputModule } from '@budgetello/front-end-shared-ui-text-input';
import { FrontEndSharedUiPasswordInputModule } from '@budgetello/front-end-shared-ui-password-input';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { TitleModule } from '@budgetello/front-end/shared/ui/title';
import { SignInWithGoogleButtonModule } from '@budgetello/front-end-auth-ui';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    TextInputModule,
    FrontEndSharedUiPasswordInputModule,
    ButtonModule,
    DividerModule,
    ToastModule,
    ReactiveFormsModule,
    TitleModule,
    TitleModule,
    SignInWithGoogleButtonModule,
  ],
})
export class LoginModule {}
