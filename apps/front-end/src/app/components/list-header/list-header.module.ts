import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListHeaderComponent } from './list-header.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { UiAsyncAutofocusModule } from '@budgetello/ui/async-autofocus';
import { ClickOutsideModule } from 'ng-click-outside';
import { MapListOperatorToIconModule } from '../../pipes/map-list-operator-to-icon/map-list-operator-to-icon.module';
import { ListContextMenuModule } from '../list-context-menu/list-context-menu.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [ListHeaderComponent],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    UiAsyncAutofocusModule,
    ClickOutsideModule,
    MapListOperatorToIconModule,
    ListContextMenuModule,
    ConfirmDialogModule,
  ],
  exports: [ListHeaderComponent],
})
export class ListHeaderModule {}
