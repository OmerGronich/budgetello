import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardHeaderComponent } from './board-header.component';
import { InplaceModule } from 'primeng/inplace';
import { SharedModule } from 'primeng/api';
import { FrontEndSharedUiAsyncAutofocusModule } from '@budgetello/front-end-shared-ui-async-autofocus';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ClickOutsideModule } from 'ng-click-outside';
import { FrontEndSharedUiDatepickerModule } from '@budgetello/front-end-shared-ui-datepicker';

@NgModule({
  declarations: [BoardHeaderComponent],
  imports: [
    CommonModule,
    InplaceModule,
    SharedModule,
    FrontEndSharedUiAsyncAutofocusModule,
    ReactiveFormsModule,
    InputTextModule,
    ConfirmDialogModule,
    ClickOutsideModule,
    FrontEndSharedUiDatepickerModule,
  ],
  exports: [BoardHeaderComponent],
})
export class BoardHeaderModule {}
