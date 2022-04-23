import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './text-input.component';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncAutofocusModule } from '@budgetello/front-end-shared-ui-async-autofocus';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    AsyncAutofocusModule,
  ],
  declarations: [TextInputComponent],
  exports: [TextInputComponent],
})
export class TextInputModule {}
