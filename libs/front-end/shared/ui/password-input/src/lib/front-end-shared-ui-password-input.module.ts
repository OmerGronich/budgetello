import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordInputComponent } from './password-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { PasswordSuggestionsModule } from './password-suggestions/password-suggestions.module';
import { AsyncAutofocusModule } from '@budgetello/front-end-shared-ui-async-autofocus';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    DividerModule,
    PasswordSuggestionsModule,
    AsyncAutofocusModule,
  ],
  declarations: [PasswordInputComponent],
  exports: [PasswordInputComponent],
})
export class FrontEndSharedUiPasswordInputModule {}
