import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './text-input.component';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { UiAsyncAutofocusModule } from '@budgetello/ui/async-autofocus';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    UiAsyncAutofocusModule,
  ],
  declarations: [TextInputComponent],
  exports: [TextInputComponent],
})
export class UiTextInputModule {}
