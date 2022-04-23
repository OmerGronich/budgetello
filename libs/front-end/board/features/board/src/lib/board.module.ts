import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { FrontEndSharedUiKanbanBoardModule } from '@budgetello/front-end-shared-ui-kanban-board';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { SharedModule } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { AsyncAutofocusModule } from '@budgetello/front-end-shared-ui-async-autofocus';
import { DropdownModule } from 'primeng/dropdown';
import { BoardRoutingModule } from './board-routing.module';
import { BoardHeaderModule } from '@budgetello/front-end/board/ui/board-header';
import { ListHeaderModule } from '@budgetello/front-end/board/ui/list-header';
import { MapListOperatorToIconModule } from '@budgetello/front-end/board/ui/map-list-operator-to-icon';
import { AddListFormModule } from '@budgetello/front-end/board/ui/add-list-form';
import { ListFooterModule } from '@budgetello/front-end/board/ui/list-footer';
import { CalculateListTotalModule } from '@budgetello/front-end/board/ui/calculate-list-total';
import { KanbanCardModule } from '@budgetello/front-end/board/ui/kanban-card';

@NgModule({
  declarations: [BoardComponent],
  imports: [
    BoardRoutingModule,
    CommonModule,
    FrontEndSharedUiKanbanBoardModule,
    ButtonModule,
    InplaceModule,
    SharedModule,
    InputTextModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    AsyncAutofocusModule,
    BoardHeaderModule,
    ListHeaderModule,
    DropdownModule,
    MapListOperatorToIconModule,
    AddListFormModule,
    ListFooterModule,
    CalculateListTotalModule,
    KanbanCardModule,
  ],
})
export class BoardModule {}
