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
  ],
})
export class BoardModule {}
