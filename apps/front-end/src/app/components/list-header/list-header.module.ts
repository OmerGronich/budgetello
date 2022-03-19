import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListHeaderComponent } from './list-header.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { UiAsyncAutofocusModule } from '@budgetello/ui/async-autofocus';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [ListHeaderComponent],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    UiAsyncAutofocusModule,
    ClickOutsideModule,
  ],
  exports: [ListHeaderComponent],
})
export class ListHeaderModule {}
