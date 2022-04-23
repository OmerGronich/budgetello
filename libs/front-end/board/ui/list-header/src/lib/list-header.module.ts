import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListHeaderComponent } from './list-header.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncAutofocusModule } from '@budgetello/front-end-shared-ui-async-autofocus';
import { ClickOutsideModule } from 'ng-click-outside';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MapListOperatorToIconModule } from '@budgetello/front-end/board/ui/map-list-operator-to-icon';
import { ListContextMenuModule } from '@budgetello/front-end/board/ui/list-context-menu';

@NgModule({
  declarations: [ListHeaderComponent],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    AsyncAutofocusModule,
    ClickOutsideModule,
    MapListOperatorToIconModule,
    ListContextMenuModule,
    ConfirmDialogModule,
  ],
  exports: [ListHeaderComponent],
})
export class ListHeaderModule {}
