import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { UiKanbanBoardModule } from '@budgetello/ui/kanban-board';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { SharedModule } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { UiAsyncAutofocusModule } from '@budgetello/ui/async-autofocus';
import { BoardHeaderModule } from '../../components/board-header/board-header.module';
import { ListHeaderModule } from '../../components/list-header/list-header.module';
import { DropdownModule } from 'primeng/dropdown';
import { MapListOperatorToIconModule } from '../../pipes/map-list-operator-to-icon/map-list-operator-to-icon.module';
import { AddListFormModule } from '../../components/add-list-form/add-list-form.module';

@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    UiKanbanBoardModule,
    ButtonModule,
    InplaceModule,
    SharedModule,
    InputTextModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    UiAsyncAutofocusModule,
    BoardHeaderModule,
    ListHeaderModule,
    DropdownModule,
    MapListOperatorToIconModule,
    AddListFormModule,
  ],
})
export class BoardModule {}
