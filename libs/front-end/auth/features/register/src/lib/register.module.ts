import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { TitleModule } from '@budgetello/front-end/shared/ui/title';
import { TextInputModule } from '@budgetello/front-end-shared-ui-text-input';
import { FrontEndSharedUiPasswordInputModule } from '@budgetello/front-end-shared-ui-password-input';
import { SignInWithGoogleButtonModule } from '@budgetello/front-end-auth-ui';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    TitleModule,
    TextInputModule,
    ReactiveFormsModule,
    FrontEndSharedUiPasswordInputModule,
    ButtonModule,
    DividerModule,
    ToastModule,
    SignInWithGoogleButtonModule,
  ],
})
export class RegisterModule {}
