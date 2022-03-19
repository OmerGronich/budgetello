import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardHeaderComponent } from './board-header.component';
import { InplaceModule } from 'primeng/inplace';
import { SharedModule } from 'primeng/api';
import { UiAsyncAutofocusModule } from '@budgetello/ui/async-autofocus';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [BoardHeaderComponent],
  imports: [
    CommonModule,
    InplaceModule,
    SharedModule,
    UiAsyncAutofocusModule,
    ReactiveFormsModule,
    InputTextModule,
    ConfirmDialogModule,
    ClickOutsideModule,
  ],
  exports: [BoardHeaderComponent],
})
export class BoardHeaderModule {}
